// Rota equivalente no outro idioma: /pt <-> /en, /blog/x <-> /en/blog/x
export function otherLangPath(pathname: string, lang: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const route = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const next = lang === "pt" ? "en" : "pt";
  if (/^\/(pt|en)\/?$/.test(route)) return { lang: next, href: `${base}/${next}` };
  const href = next === "en" ? `${base}/en${route}` : `${base}${route.replace(/^\/en/, "")}`;
  return { lang: next, href };
}
