// Rastreador anônimo de acessos e cliques (contrato em docs/analytics-architecture.md).
// Fica desligado enquanto PUBLIC_COLLECTOR_URL não estiver definido no build;
// em dev, os envios aparecem no console.

type EventType = "pageview" | "click" | "read" | "engage";
type TrackEvent = { t: EventType; p: string; o: number; n?: string; d?: number };

const ENDPOINT: string | undefined = import.meta.env.PUBLIC_COLLECTOR_URL;
const MAX_BATCH = 50;
const FLUSH_MS = 20_000;
// Cliques que levam o visitante para fora: enviados na hora
const EXIT_CLICKS = /^(cv_download|linkedin|github|email_send|project_demo:|project_code:)/;

let queue: TrackEvent[] = [];
let pageStart = performance.now();
let path = location.pathname;
let activeMs = 0;
let visibleSince: number | null = document.visibilityState === "visible" ? performance.now() : null;
let readMarks = new Set<number>();
let timer: ReturnType<typeof setInterval> | undefined;
let started = false;

const offset = () => Math.max(0, Math.round(performance.now() - pageStart));

function lang() {
  return document.documentElement.lang.startsWith("en") ? "en" : "pt";
}

// Referrer externo só no primeiro envio da visita
function referrer() {
  try {
    if (sessionStorage.getItem("trk_ref")) return undefined;
    sessionStorage.setItem("trk_ref", "1");
  } catch {}
  if (!document.referrer) return undefined;
  try {
    const ref = new URL(document.referrer);
    return ref.host === location.host ? undefined : ref.origin + "/";
  } catch {
    return undefined;
  }
}

function send(events: TrackEvent[]) {
  for (let i = 0; i < events.length; i += MAX_BATCH) {
    const body = JSON.stringify({
      v: 1,
      s: location.host,
      l: lang(),
      r: referrer(),
      w: window.innerWidth,
      e: events.slice(i, i + MAX_BATCH),
    });
    if (!ENDPOINT) {
      if (import.meta.env.DEV) console.debug("[track]", JSON.parse(body));
      continue;
    }
    // text/plain evita preflight de CORS; o navegador entrega mesmo após fechar a aba
    const blob = new Blob([body], { type: "text/plain" });
    if (!navigator.sendBeacon?.(ENDPOINT, blob)) {
      fetch(ENDPOINT, { method: "POST", body: blob, keepalive: true, mode: "no-cors" }).catch(() => {});
    }
  }
}

function flush() {
  if (!queue.length) return;
  const batch = queue;
  queue = [];
  send(batch);
}

function push(ev: Omit<TrackEvent, "p" | "o">, now = false) {
  queue.push({ ...ev, p: path, o: offset() });
  if (now || queue.length >= MAX_BATCH) flush();
}

export function track(name: string) {
  if (!/^[a-z0-9_:-]{1,64}$/.test(name)) return;
  push({ t: "click", n: name }, EXIT_CLICKS.test(name));
}

// Tempo com a aba visível na página atual
function pauseActive() {
  if (visibleSince !== null) {
    activeMs += performance.now() - visibleSince;
    visibleSince = null;
  }
}

function endPage() {
  pauseActive();
  if (activeMs >= 1000) push({ t: "engage", d: Math.round(activeMs) });
  activeMs = 0;
}

function startPage() {
  path = location.pathname;
  pageStart = performance.now();
  activeMs = 0;
  visibleSince = document.visibilityState === "visible" ? performance.now() : null;
  readMarks = new Set();
  push({ t: "pageview" }, true);
}

// Leitura de artigo: marca 50% e 90% do texto
function checkRead() {
  const prose = document.querySelector<HTMLElement>(".reader .prose");
  const slug = document.querySelector<HTMLElement>(".reader[data-slug]")?.dataset.slug;
  if (!prose || !slug) return;
  const r = prose.getBoundingClientRect();
  const seen = (window.innerHeight - r.top) / Math.max(1, r.height);
  for (const mark of [50, 90]) {
    if (seen * 100 >= mark && !readMarks.has(mark)) {
      readMarks.add(mark);
      push({ t: "read", n: `${slug}:${mark}`.slice(0, 64) });
    }
  }
}

export function initTracking() {
  if (started) return;
  started = true;

  document.addEventListener("astro:page-load", startPage);
  // Troca de página pelo ClientRouter: fecha a anterior antes de trocar a URL
  document.addEventListener("astro:before-preparation", () => { endPage(); flush(); });

  // Um único listener para todos os elementos com data-track
  document.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
    if (el?.dataset.track) track(el.dataset.track);
  }, { capture: true });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      endPage();
      flush();
    } else {
      visibleSince = performance.now();
    }
  });
  window.addEventListener("pagehide", () => { endPage(); flush(); });
  window.addEventListener("scroll", checkRead, { passive: true });

  timer ??= setInterval(flush, FLUSH_MS);
}
