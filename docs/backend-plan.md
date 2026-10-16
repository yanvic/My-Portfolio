# Mini back-end — plano (fase 2)

O site é 100% estático hoje (GitHub Pages, sem banco). Este plano cobre o que fica para depois: **saber o que o visitante faz** e **editar artigos, fotos e projetos sem mexer em código**.

## 1. Analytics: o que o visitante fez

**Decidido:** coletor próprio em Rust numa VPS (Hostinger KVM), com SQLite, sem gravar IP e com dashboard acessível só por túnel SSH.
Arquitetura completa, com formato dos eventos, comunicação interna, schema, retenção e segurança: [analytics-architecture.md](analytics-architecture.md).

## 2. Editar conteúdo sem código

O conteúdo já está separado em `src/content/` (YAML e Markdown validados no build). Isso permite plugar um **CMS baseado em Git**, sem banco de dados:

```
você ──▶ /admin (Sveltia CMS) ──login GitHub──▶ commit no repo ──▶ Action ──▶ site atualizado
```

**Sveltia CMS** (compatível com Decap):

1. `public/admin/index.html` carrega o CMS.
2. `public/admin/config.yml` descreve as coleções que já existem:
   - `blog` (Markdown, com upload de capa)
   - `projects` (um YAML por projeto, com upload de print)
   - `photos`, `books`, `career`, `techs` (arquivos YAML de `src/content/data/`)
3. Login pelo GitHub: um Worker pequeno faz o OAuth (o template oficial é o `sveltia-cms-auth`).
4. Cada "Publicar" vira um commit e o deploy é automático.

Resultado: dá para escrever um artigo, trocar uma foto ou adicionar um projeto pelo navegador, inclusive no celular.

Alternativa: Keystatic. A interface é mais bonita, mas para editar via GitHub ele precisa de servidor, o que tira o site do GitHub Pages.

## 3. Ordem sugerida

1. **Agora**: site estático no GitHub Pages.
2. **Fase 2a**: coletor Rust + rastreador no site (ver [analytics-architecture.md](analytics-architecture.md), seção 11).
3. **Fase 2b**: dashboard do coletor.
4. **Fase 3**: Sveltia CMS em `/admin` + Worker de OAuth.
