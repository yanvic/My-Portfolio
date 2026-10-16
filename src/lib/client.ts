// Utilitários do lado do cliente compartilhados entre os layouts

export function readTheme(): "light" | "dark" {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Mantém tema e estado do reveal durante a troca de página (ClientRouter)
export function keepTheme() {
  document.addEventListener("astro:before-swap", (ev) => {
    const html = ev.newDocument.documentElement;
    html.setAttribute("data-theme", readTheme());
    // mantém as animações de entrada na página nova
    html.classList.add("reveal");
    html.setAttribute("data-reveal-ready", "");
  });
}

// Scroll reveal: adiciona .animate-in quando [data-animate] entra na tela
export function initReveal() {
  document.documentElement.setAttribute("data-reveal-ready", "");
  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-animate]:not(.animate-in)"));
  const vh = window.innerHeight;

  // Back-navigation com scroll restaurado: mostra o que já está acima da dobra sem animar
  if (window.scrollY > 50) {
    elements.forEach((el) => {
      if (el.getBoundingClientRect().top < vh) {
        el.style.transition = "none";
        el.classList.add("animate-in");
        requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = ""; }));
      }
    });
  }

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("animate-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
  );
  elements.forEach((el) => { if (!el.classList.contains("animate-in")) observer.observe(el); });
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(message: string) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("on"), 2200);
}

export function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
    ta.remove();
  });
}
