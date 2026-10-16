# Analytics — arquitetura

Coletor próprio, leve, em Rust, numa VPS (Hostinger KVM). Mede o movimento do site: acessos, cliques, origem, cidade e dispositivo. **Nenhum IP é gravado.** O dashboard é acessível só por você, via túnel SSH.

Status: **front pronto** (`src/lib/track.ts`, desligado até `PUBLIC_COLLECTOR_URL` existir). **Back-end Rust: a implementar.**

---

## 1. Visão geral

```
┌───────────────────────────┐        HTTPS (sendBeacon, text/plain)
│ Site estático             │ ─────────────────────────────────────────┐
│ yanvic.github.io (Pages)  │                                          │
│ src/lib/track.ts          │                                          ▼
└───────────────────────────┘                          ┌──────────────────────────────┐
                                                       │ VPS (Ubuntu)                 │
                                                       │                              │
                                                       │  Caddy :443 (HTTPS automático)│
                                                       │    └─▶ 127.0.0.1:8080 /e     │
                                                       │                              │
                                                       │  collector (binário Rust)    │
                                                       │   ├─ API pública   :8080     │
                                                       │   ├─ fila em memória (mpsc)  │
                                                       │   ├─ writer → SQLite (WAL)   │
                                                       │   ├─ jobs (resumo, limpeza)  │
                                                       │   └─ dashboard 127.0.0.1:8081│
                                                       │                              │
                                                       │  /var/lib/collector/         │
                                                       │   ├─ events.db               │
                                                       │   └─ geo.mmdb (DB-IP Lite)   │
                                                       └──────────────────────────────┘
                                                                     ▲
                       você ── ssh -L 8081:127.0.0.1:8081 vps ───────┘  (navegador em localhost:8081)
```

Três canais de comunicação:

| De → para | Como | Exposto à internet? |
|---|---|---|
| Site → coletor | `POST https://<host>/e` via `navigator.sendBeacon` | sim (porta 443, via Caddy) |
| Dentro do coletor | canal `tokio::mpsc` (handler → writer) e SQLite | não |
| Você → dashboard | túnel SSH até `127.0.0.1:8081` | **não** |

---

## 2. Navegador: como os eventos saem

Arquivo: `src/lib/track.ts`, carregado pelos dois layouts. Fica desligado se `PUBLIC_COLLECTOR_URL` não estiver definido no build. Em `npm run dev`, cada envio aparece no console como `[track]`.

### Eventos

| `t` (tipo) | `n` (nome) | Quando |
|---|---|---|
| `pageview` | — | ao abrir cada página (inclui trocas pelo ClientRouter, `astro:page-load`) |
| `click` | `cv_download`, `linkedin`, `github`, `email_copy`, `email_send` | contato e hero |
| `click` | `project_demo:<slug>`, `project_code:<slug>` | cards de projeto |
| `click` | `nav:<seção>`, `lang:<pt|en>`, `theme:<light|dark>` | header |
| `click` | `post_open:<slug>`, `post_copy_link`, `code_copy`, `post_contact`, `post_prev`, `post_next` | blog |
| `click` | `blog_filter:<tag>`, `blog_all`, `archive_filter:<tag>` | filtros do blog |
| `click` | `cta_projects`, `photo:<id>`, `photo_like` | hero e "Fora da tela" |
| `click` | `book:<id>`, `book_filter:<status>`, `book_review:<slug>` | estante |
| `read` | `<slug>:50` / `<slug>:90` | ao passar de 50% e 90% do artigo |
| `engage` | — (campo `d` = ms com a aba visível) | ao esconder/sair da página; soma = tempo real na página |

**Views do blog** = `pageview` com `path` em `/blog/<slug>` ou `/en/blog/<slug>`. As leituras reais vêm de `read` (50% e 90%) e o tempo de leitura, de `engage`.

Os elementos ganham `data-track="nome"`. Um único listener de clique em `document` lê o atributo, sem handler por botão.

### Quando envia (e se fechar a aba?)

- **`pageview`:** sai na hora, com um beacon próprio. O acesso é sempre contado.
- **Demais eventos:** vão para uma fila em memória, enviada quando:
  1. `visibilitychange` → `hidden` (fechar aba, trocar de app no celular, minimizar). É o gatilho principal;
  2. `pagehide` (fechar ou navegar para fora);
  3. passam 20 s com algo na fila;
  4. acontece um clique "de saída" (`cv_download`, `linkedin`, `github`, `project_*`), que sai na hora, porque o visitante vai sair da página.
- O `sendBeacon` continua entregando **depois** que a aba fecha. Só há perda se o navegador travar ou estiver sem rede (estimativa: 1–3%).
- Máximo de 50 eventos por envio. Se passar disso, divide em mais de um.

### Formato enviado (`Content-Type: text/plain`, evita o preflight de CORS)

```json
{
  "v": 1,
  "s": "yanvic.github.io",
  "l": "pt",
  "r": "https://www.linkedin.com/",
  "w": 390,
  "e": [
    { "t": "pageview", "p": "/My-Portfolio/pt", "o": 0 },
    { "t": "click", "n": "cv_download", "p": "/My-Portfolio/pt", "o": 12400 }
  ]
}
```

| Campo | Significado |
|---|---|
| `v` | versão do formato |
| `s` | site de origem (conferido pelo servidor) |
| `l` | idioma da página |
| `r` | referrer (só no primeiro envio da visita) |
| `w` | largura da tela, para classificar o dispositivo |
| `e[].o` | milissegundos desde o carregamento da página. O servidor calcula o horário real; o relógio do cliente nunca é usado |
| `e[].d` | só em `engage`: milissegundos com a aba visível desde o último envio |

---

## 3. API pública do coletor

`POST /e`, atrás do Caddy.

| Resposta | Quando |
|---|---|
| `204 No Content` | aceito (inclusive quando descartado em silêncio, como robôs: o cliente não precisa saber) |
| `400` | JSON inválido ou fora do esquema |
| `403` | `Origin`/`Referer` diferente do site |
| `413` | corpo maior que 8 KB |
| `429` | passou do rate limit |

`GET /health` → `200 ok`, para monitoramento.

O handler **não toca no banco**. Ele valida, enriquece e coloca na fila. Tempo alvo: menos de 1 ms.

### Validação (antes de qualquer coisa ir para a fila)

- **Corpo:** no máximo 8 KB, limitado na leitura com `DefaultBodyLimit`.
- **Esquema:** JSON com `serde` e `#[serde(deny_unknown_fields)]`.
- **`v`:** precisa ser `1`.
- **`e`:** entre 1 e 50 itens.
- **`t`:** enum fechado (`pageview`, `click`, `read`, `engage`).
- **`d`:** só em `engage`, entre 1.000 e 14.400.000 (4 h).
- **`n`:** regex `^[a-z0-9_:-]{1,64}$`.
- **`p`:** até 200 caracteres e começando com `/My-Portfolio/`, ou o caminho base vigente.
- **`r`:** até 300 caracteres, guardado só o host (`linkedin.com`).
- **`o`:** entre 0 e 86.400.000.
- **`l`:** `pt` ou `en`.
- **Origem:** `Origin` ou `Referer` precisa ser `https://yanvic.github.io` (lista em config).
- **Robôs:** `User-Agent` com `bot|crawler|spider|curl|wget|python|headless` → descartado com `204`.

### Enriquecimento (dados derivados no servidor)

| Gerado | Origem | O que acontece com o dado de entrada |
|---|---|---|
| `ts` | relógio do servidor (UTC) + `o` | — |
| `city`, `region`, `country` | IP consultado no `geo.mmdb` (em memória, ~µs) | **IP descartado** logo após a consulta |
| `device` | `w` (até 760 = mobile, até 1100 = tablet, acima = desktop) | — |
| `browser` | família extraída do User-Agent (Chrome/Safari/Firefox/Edge/outro) | **UA completo descartado** |
| `visitor` | `sha256(daily_salt + ip + ua)`, truncado em 16 caracteres hex | salt diário: não dá para ligar visitas entre dias |

---

## 4. Comunicação interna do Rust

```
         ┌─────────────────────────── processo collector (tokio) ───────────────────────────┐
         │                                                                                   │
 HTTP ──▶│ axum handler POST /e ──valida/enriquece──▶ mpsc::Sender<Event> (cap. 10.000)       │
         │                                                   │                               │
         │                                                   ▼                               │
         │                                writer task: junta até 500 eventos ou 5 s          │
         │                                   └─ 1 transação: INSERT em lote (prepared)       │
         │                                                   │                               │
         │                                                   ▼                               │
         │                                        SQLite events.db (WAL)                     │
         │                                          ▲            ▲                           │
         │   jobs task (tokio interval) ────────────┘            │                           │
         │     · a cada hora: recalcula daily_stats de hoje      │                           │
         │     · 00:05 UTC: fecha ontem, troca salt, apaga > 90d │                           │
         │                                                       │                           │
 SSH ───▶│ axum dashboard 127.0.0.1:8081 ── conexão read-only ───┘                           │
         │   GET /  ·  GET /api/summary  ·  GET /export.csv                                  │
         └───────────────────────────────────────────────────────────────────────────────────┘
```

- **Um único escritor.** Só a writer task grava eventos, então não há disputa de lock no SQLite. Os jobs também gravam, mas em horários espaçados e pelo mesmo writer, via uma mensagem `Job` no canal.
- **Fila cheia** (10 mil eventos pendentes, o que só aconteceria num ataque): o handler descarta e responde `204`. O servidor nunca trava esperando o disco.
- **Desligamento (SIGTERM do systemd):** para de aceitar requisições, esvazia a fila, faz a última transação e fecha. Nenhum evento aceito é perdido.
- **Dashboard em outra porta** e em outra conexão SQLite (somente leitura). Graças ao WAL, ler não bloqueia gravar.
- **Estado compartilhado** (`Arc<AppState>`): config, leitor do `geo.mmdb`, salt do dia (`RwLock`), rate limiter e o `Sender` do canal.

### Rate limit (em memória, sem gravar IP)

- Mapa `HashMap<IpAddr, (contador, janela)>`, com 30 requisições por minuto por IP.
- Limpo a cada 5 min. Só existe em RAM e some no restart.
- O Caddy também limita conexões. Proteção contra DDoS grande só com um proxy na frente (ver seção 9).

---

## 5. Banco: SQLite

Arquivo `/var/lib/collector/events.db`, com `PRAGMA journal_mode=WAL; synchronous=NORMAL;`.

```sql
-- eventos brutos: guardados por 90 dias
CREATE TABLE events (
  id       INTEGER PRIMARY KEY,
  ts       INTEGER NOT NULL,          -- epoch ms UTC (servidor)
  day      TEXT    NOT NULL,          -- 'YYYY-MM-DD' (America/Fortaleza)
  type     TEXT    NOT NULL CHECK (type IN ('pageview','click','read','engage')),
  name     TEXT,                      -- ex.: 'cv_download'
  path     TEXT    NOT NULL,
  duration INTEGER,                   -- ms ativos (só engage)
  lang     TEXT,
  referrer TEXT,                      -- só o host
  country  TEXT,
  region   TEXT,
  city     TEXT,
  device   TEXT,                      -- mobile | tablet | desktop
  browser  TEXT,
  visitor  TEXT    NOT NULL           -- hash diário, 16 hex
);
CREATE INDEX events_day      ON events(day);
CREATE INDEX events_day_type ON events(day, type, name);

-- resumo diário: guardado para sempre
CREATE TABLE daily_stats (
  day    TEXT NOT NULL,
  metric TEXT NOT NULL,   -- 'pageviews' | 'visitors' | 'click' | 'read' | 'path' | 'post_views' | 'engaged_ms' | 'city' | 'referrer' | 'device' | 'lang'
  key    TEXT NOT NULL,   -- ex.: '/My-Portfolio/pt', 'cv_download', 'rust-para-backend', 'Fortaleza', 'linkedin.com', '' p/ totais
  value  INTEGER NOT NULL,
  PRIMARY KEY (day, metric, key)
);

-- chave do visitante único (uma linha, trocada todo dia)
CREATE TABLE salt (day TEXT PRIMARY KEY, value BLOB NOT NULL);
```

**Contra SQL injection:** toda consulta usa *prepared statements* com parâmetros (`rusqlite::params!`), sem exceção. Nenhuma string vinda da rede é concatenada em SQL. A validação da seção 3 é uma segunda camada.

### Retenção: o que fica e o que é apagado

| Dado | Exemplo | Retenção |
|---|---|---|
| `events` | "12/10 14:32, Fortaleza, mobile, Safari, `click cv_download`, veio de linkedin.com" | **90 dias** |
| `daily_stats` | "12/10: 48 acessos, 31 visitantes, 9 `cv_download`, 21 Fortaleza" | **para sempre** |
| `salt` | bytes aleatórios | **1 dia** (o de ontem é apagado) |
| **Nunca gravado** | IP, User-Agent completo, cookies, qualquer dado pessoal | — |

Estimativa: 1.000 eventos por dia × ~150 B = ~15 MB por 90 dias. Os resumos ocupam menos de 2 MB por ano.

---

## 6. Jobs

| Quando | O quê |
|---|---|
| a cada 5 s ou 500 eventos | grava o lote em `events` |
| a cada 1 h | `INSERT ... ON CONFLICT DO UPDATE` em `daily_stats` para **hoje**, a partir de `events` |
| 00:05 (America/Fortaleza) | fecha o resumo de **ontem**, gera o novo salt, apaga o salt de ontem e roda `DELETE FROM events WHERE day < date('now','-90 days')` |
| domingo 03:00 | `PRAGMA optimize;` e checkpoint do WAL |

Backup: `sqlite3 events.db ".backup /var/backups/collector-$(date +%F).db"` via cron do sistema, guardando 7 cópias.

---

## 7. Dashboard (só você)

- Escuta **apenas** em `127.0.0.1:8081`. O firewall nem precisa abrir essa porta.
- Acesso:
  ```bash
  ssh -L 8081:127.0.0.1:8081 usuario@IP_DA_VPS
  # abrir http://localhost:8081
  ```
- Rotas:
  - `GET /`: página HTML gerada pelo servidor (template `askama`) com gráficos em SVG e sem framework de JS. Mostra acessos e visitantes por dia (30/90 dias), páginas mais vistas, cliques (com destaque para `cv_download`), cidades, origens, dispositivos e idioma.
  - `GET /api/summary?from=&to=`: JSON lido de `daily_stats`.
  - `GET /events?day=`: eventos brutos de um dia (para investigar).
  - `GET /export.csv?from=&to=`: exportação.
- Lê `daily_stats` para os gráficos, então é rápido mesmo com anos de dados. `events` só é lido no detalhe de um dia.

---

## 8. Infra na VPS

| Peça | Função |
|---|---|
| **Caddy** | HTTPS automático (Let's Encrypt) e proxy de `:443` para `127.0.0.1:8080`, só para `/e` e `/health` |
| **Host sem domínio** | `<ip-com-hífens>.sslip.io` (DNS gratuito que aponta para o IP), suficiente para o certificado. Com domínio próprio no futuro, troca-se por `e.seudominio` |
| **systemd** | `collector.service` com `User=collector` (sem privilégios), `Restart=always`, `NoNewPrivileges`, `ProtectSystem=strict`, `ReadWritePaths=/var/lib/collector`, `PrivateTmp` |
| **Firewall (ufw)** | permite só 22, 80 (desafio do certificado) e 443 |
| **SSH** | só chave, `PasswordAuthentication no`, fail2ban |
| **geo.mmdb** | DB-IP "IP to City Lite" (grátis, CC-BY, atualizado todo mês). Um cron mensal baixa a versão nova |

Exemplo de `Caddyfile`:
```
203-0-113-10.sslip.io {
  @collector path /e /health
  handle @collector {
    reverse_proxy 127.0.0.1:8080
  }
  handle {
    respond 404
  }
}
```

### Configuração do coletor (variáveis de ambiente)

| Variável | Exemplo |
|---|---|
| `COLLECTOR_PUBLIC_ADDR` | `127.0.0.1:8080` |
| `COLLECTOR_DASH_ADDR` | `127.0.0.1:8081` |
| `COLLECTOR_DB` | `/var/lib/collector/events.db` |
| `COLLECTOR_GEO_DB` | `/var/lib/collector/geo.mmdb` |
| `COLLECTOR_ALLOWED_ORIGINS` | `https://yanvic.github.io` |
| `COLLECTOR_BASE_PATH` | `/My-Portfolio/` |
| `COLLECTOR_TZ` | `America/Fortaleza` |
| `COLLECTOR_RETENTION_DAYS` | `90` |

O IP real chega pelo Caddy no cabeçalho `X-Forwarded-For`. Só se confia nesse cabeçalho porque a porta 8080 escuta em `127.0.0.1`.

No site: `PUBLIC_COLLECTOR_URL=https://203-0-113-10.sslip.io/e`, definido como variável do repositório no GitHub Actions. Sem ela, o rastreador fica desligado.

---

## 9. Limites e riscos conhecidos

| Risco | Mitigação |
|---|---|
| Ataque DDoS volumoso | a VPS sozinha não aguenta. Se acontecer: domínio próprio + Cloudflare grátis na frente (esconde o IP e absorve o ataque; de quebra entrega a cidade em cabeçalho, dispensando o `geo.mmdb`) |
| Bloqueadores de anúncio | caminho neutro (`/e`) e host próprio reduzem o bloqueio, mas parte dos visitantes não será contada |
| Eventos falsos (alguém fazendo POST manual) | origem, rate limit e validação. Não dá para impedir 100% num endpoint público, e para estatística de portfólio é aceitável |
| VPS fora do ar | o site continua funcionando normalmente. Os eventos daquele período se perdem e nada quebra para o visitante |
| Perda do disco | backup diário (7 cópias). Opcional: copiar para fora da VPS |

**LGPD:** sem IP nem identificador persistente, o risco é baixo. Mesmo assim, uma linha no rodapé ("este site registra acessos e cliques de forma anônima para estatística") mantém tudo transparente.

---

## 10. Estrutura do crate (para a implementação)

```
collector/
  Cargo.toml          # axum, tokio, serde, serde_json, rusqlite (bundled), maxminddb, askama, sha2, rand, chrono, chrono-tz
  src/
    main.rs           # config, AppState, sobe os 2 listeners e as tasks, shutdown gracioso
    config.rs         # leitura das variáveis de ambiente
    api.rs            # POST /e, GET /health
    event.rs          # structs serde + validação
    enrich.rs         # geo, device, browser, visitor hash
    ratelimit.rs      # limiter em memória
    writer.rs         # task: canal → lote → SQLite
    jobs.rs           # resumo, troca de salt, limpeza
    db.rs             # schema/migrações, queries (todas prepared)
    dash.rs           # rotas do dashboard
  templates/
    dash.html         # template askama
  deploy/
    Caddyfile
    collector.service
    backup.sh
    update-geo.sh
```

Do lado do site (**já feito**): `src/lib/track.ts`, atributos `data-track` nos elementos da seção 2 e o aviso no rodapé (aparece só com `PUBLIC_COLLECTOR_URL` definido).

## 11. Ordem de implementação

1. `event.rs` + `api.rs` + `writer.rs` + `db.rs`: receber e gravar (testável com `curl`).
2. ~~`track.ts` no site + `data-track` + aviso no rodapé~~ ✅ feito. Para ligar: definir a variável `PUBLIC_COLLECTOR_URL` no repositório (Settings → Secrets and variables → Actions → Variables).
3. `enrich.rs` (cidade, dispositivo, visitante) + `ratelimit.rs`.
4. `jobs.rs` (resumo, salt, retenção).
5. Deploy na VPS (Caddy, systemd, firewall, backup).
6. `dash.rs` + template.
