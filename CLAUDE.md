# Portfolio — Project Context

## Stack
- **Astro 5**, static output, deployed to GitHub Pages via `.github/workflows/deploy.yml`
- Plain CSS (no Tailwind/React), vanilla TS component scripts
- No backend yet. Analytics design (Rust collector on VPS): `docs/analytics-architecture.md`; CMS plan: `docs/backend-plan.md`

## Language Routing
- `/pt/*` → Portuguese (default), `/en/*` → English
- `src/i18n/translate.js` — single source of truth for all UI strings
- Root `/` always redirects to `/pt` (EN only via the PT/EN header link)

## Key Files
| File | Purpose |
|---|---|
| `src/layouts/Layout.astro` | Home layout (aura bg + triangles, floating header, footer) |
| `src/layouts/LayoutBlog.astro` | Blog layout (aura bg, no triangles, reading progress bar, toast) |
| `src/components/BaseHead.astro` | Shared `<head>`: SEO, fonts (Bricolage Grotesque + JetBrains Mono), anti-FOUC theme |
| `src/components/Header.astro` | Floating pill navbar: sections, theme switch, PT/EN link (`variant="home" \| "blog"`) |
| `src/components/Logo.astro` | "Commits" logo SVG (pass unique `id`) |
| `src/components/home/*.astro` | Home sections: Hero, Projects, About, Career, Offscreen, BlogPreview, Contact |
| `src/components/blog/*.astro` | Archive (search/filter/sort), Article (TOC, copy code, pager), PostCard, Cover |
| `src/lib/client.ts` | Client helpers: scroll reveal, theme keep, toast, copy |
| `src/lib/posts.ts` | Blog collection helpers (sorting, slugs, dates, URLs) |
| `src/i18n/translate.js` | All `en`/`pt` strings, grouped by section |
| `src/styles/global.css` | Tokens (current palette), background, triangles, header, shared pieces, `[data-animate]` |
| `src/styles/blog.css` | Blog archive + reader styles |
| `src/lib/routes.ts` | Same route in the other language (header link + hreflang) |
| `src/content.config.ts` | Collections: blog, projects, career, photos, books, techs |

## Content (edit here, not in components)
- `src/content/blog/*.md` — posts (`cover`, `draft` optional)
- `src/content/projects/*.yaml` — one per project, `text.pt` / `text.en`
- `src/content/data/{career,photos,books,techs}.yaml` — lists; images in `src/assets/hobbies` / `src/assets/techs`
- `src/i18n/translate.js` — UI strings only

## Scripts
Component scripts init on `astro:page-load` (ClientRouter is on), never on DOMContentLoaded.

## Dev
```bash
npm run dev    # start dev server
npm run build  # production build
```
