# yan.dev — portfólio

Portfólio e blog de Yan Silva. Astro 5, site 100% estático, publicado no GitHub Pages.

- PT: `/pt` · EN: `/en` · Blog: `/blog` e `/en/blog`
- Produção: https://yanvic.github.io/My-Portfolio/

## Rodar

```bash
npm install
npm run dev      # http://localhost:4321/My-Portfolio
npm run build    # gera dist/
npm run preview  # serve o build
```

## Editar conteúdo

Tudo que muda com frequência fica em `src/content/` — não precisa mexer em componente.

| O quê | Onde | Como |
|---|---|---|
| Artigo | `src/content/blog/*.md` | Um arquivo por artigo. Frontmatter: `title`, `description`, `date`, `tag`, `readTime`, opcionais `cover` (imagem ao lado do .md) e `draft: true` (não publica). |
| Projeto | `src/content/projects/*.yaml` | Um arquivo por projeto. `order`, `techs`, `demo`, `code`, textos `pt`/`en`. Print real: imagem na mesma pasta + `image: ./arquivo.png`. |
| Trajetória | `src/content/data/career.yaml` | Lista de "commits", do mais recente ao mais antigo. |
| Fotos (Fora da tela) | `src/content/data/photos.yaml` + `src/assets/hobbies/` | Coloque a foto na pasta e adicione um item com `file`. |
| Livros | `src/content/data/books.yaml` | Título, autor, cor, lombada, `status` (`reading`/`read`/`queue`), `progress` (% lido), `note` e `review` (ver abaixo). |
| Tecnologias | `src/content/data/techs.yaml` + `src/assets/techs/` | `row: 1` linguagens, `row: 2` infra/ferramentas. |
| Textos da interface | `src/i18n/translate.js` | Títulos, botões, contato etc. em `pt` e `en`. |
| Currículo | `public/cv/curriculo.pdf` | Substitua o arquivo. |

### Review de livro

1. Escreva o artigo normalmente em `src/content/blog/review-<livro>.md` (sugestão: `tag: "Livros"`).
2. No livro em `books.yaml`: `status: read` e `review: review-<livro>` (o nome do arquivo sem `.md`).
3. Na estante, ao passar o mouse ou tocar no livro, aparece o preview do primeiro parágrafo do review e o botão "Ler review completo".

Se o `review` apontar para um artigo que não existe, o build avisa no terminal e o livro aparece sem o link.

O build valida os campos: se faltar algo obrigatório, `npm run build` mostra o arquivo e o campo.

## Analytics

O front já registra acessos, cliques, leituras e tempo na página (`src/lib/track.ts`), mas fica **desligado** até existir o coletor.
Para ligar: definir `PUBLIC_COLLECTOR_URL` em Settings → Secrets and variables → Actions → Variables. Em dev, os eventos aparecem no console como `[track]`.
Arquitetura do back-end: [docs/analytics-architecture.md](docs/analytics-architecture.md).

## Deploy

Push na `main` → GitHub Actions (`.github/workflows/deploy.yml`) faz o build e publica no GitHub Pages.

Primeira vez: no GitHub, **Settings → Pages → Source: GitHub Actions**.

Domínio próprio: DNS com CNAME para `yanvic.github.io`, criar `public/CNAME` com o domínio e trocar em `astro.config.mjs` `site` para o domínio e `base` para `'/'`.

## Estrutura

```
src/
  components/   Header, Footer, Logo, BaseHead, home/*, blog/*
  content/      artigos, projetos e dados (ver tabela acima)
  i18n/         textos pt/en
  layouts/      Layout (home) e LayoutBlog
  lib/          helpers (posts, rotas, scripts do cliente, carrossel)
  pages/        rotas pt, en, blog, 404
  styles/       global.css (tokens, fundo, header) e blog.css
```
