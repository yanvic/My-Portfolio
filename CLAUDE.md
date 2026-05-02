# Portfolio — Project Context

## Stack
- **Astro 5** (static output) + **React 19** (interactive islands via `client:load`)
- **Tailwind CSS v4** via Vite plugin
- **SQLite** (`better-sqlite3`) for blog view counts
- **Node adapter** for API routes (`/src/pages/api/`)

## Language Routing
- `/pt/*` → Portuguese (default), `/en/*` → English
- `src/i18n/translate.js` — single source of truth for all UI strings
- Root `/` redirects based on `localStorage.lang`

## Key Files
| File | Purpose |
|---|---|
| `src/layouts/Layout.astro` | Main layout (Navbar, triangles bg, scroll animations, ViewTransitions) |
| `src/layouts/LayoutBlog.astro` | Blog layout (BlogNavbar, no triangles bg) |
| `src/i18n/translate.js` | All `en`/`pt` translations |
| `src/styles/global.css` | Theme variables, `[data-animate]` scroll reveal system, triangle keyframes |
| `src/styles/navbar.css` | Floating pill navbar + actions (theme toggle, lang switch) |
| `src/styles/footer.css` | Footer with social buttons + resume dropdown |
| `src/components/Navbar.jsx` | React: IntersectionObserver section tracking, theme toggle, lang switch |
| `src/components/BlogNavbar.jsx` | React: minimal header for blog (theme + lang only) |
| `src/pages/pt/index.astro` | PT homepage |
| `src/pages/en/index.astro` | EN homepage |
| `src/pages/blog/index.astro` | PT blog listing |
| `src/pages/en/blog/index.astro` | EN blog listing |
| `src/pages/blog/[slug].astro` | Individual blog post (language-agnostic) |
| `src/pages/api/views.ts` | GET/POST view counts via SQLite |

## Scroll Animation System
Elements get `data-animate="fade-up|fade-down|fade-left|fade-right|zoom-in|zoom-out|flip"` and optional `data-delay="100|200|300|400|500|600"`. IntersectionObserver in `Layout.astro` adds `animate-in` class when in view. Defined in `global.css`.

## Triangle Background
80 `<div class="tri">` in `Layout.astro` (NOT in `LayoutBlog.astro`). Each has CSS custom properties (`--size`, `--x`, `--y`, `--z`, `--r`, `--d`) set inline. Animated via `@keyframes fly` in `global.css`.

## Theme System
- Stored in `localStorage.theme` (`"light"` | `"dark"`)
- Applied via `data-theme` attribute on `<html>`
- Anti-FOUC inline script in both layouts
- CSS variables in `global.css` under `[data-theme="light"]` / `[data-theme="dark"]`

## Blog
- Content in `src/content/blog/*.md` with frontmatter: `title`, `description`, `date`, `tag`, `readTime`
- View counts tracked via `/api/views` + `views.db` (SQLite)
- PT blog: `/blog/` | EN blog: `/en/blog/`
- Individual posts: `/blog/[slug]` (always PT layout for now)

## Component Conventions
- Pass `t` (translation object) and `lang` as props from page → components
- `Article.astro` needs both `t` and `lang` to compute the correct blog link
- `Footer.astro` needs `t` for translated strings

## Dev
```bash
npm run dev    # start dev server
npm run build  # production build
```
