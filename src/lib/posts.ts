import { getCollection } from "astro:content";

export const slugOf = (id: string) => id.replace(/\.md$/, "");
export const tagKey = (tag: string) => tag.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");

export async function getPosts() {
  // Rascunhos só aparecem com SHOW_DRAFTS=1 (ex.: SHOW_DRAFTS=1 npm run dev)
  return (await getCollection("blog", ({ data }) => import.meta.env.SHOW_DRAFTS === "1" || !data.draft)).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function blogBase(lang: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return lang === "en" ? `${base}/en/blog` : `${base}/blog`;
}

export function formatDate(date: Date, locale: string, long = false) {
  return date.toLocaleDateString(locale, long
    ? { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
    : { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
}
