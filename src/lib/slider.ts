// Carrossel com scroll-snap: descobre o item central e navega por índice
export function slider(track: HTMLElement, onChange: (i: number) => void) {
  const items = track.children;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function idx() {
    const r = track.getBoundingClientRect();
    const c = r.left + r.width / 2;
    let best = 0;
    let d = Infinity;
    for (let k = 0; k < items.length; k++) {
      const b = items[k].getBoundingClientRect();
      const dd = Math.abs(b.left + b.width / 2 - c);
      if (dd < d) { d = dd; best = k; }
    }
    return best;
  }

  function go(i: number) {
    i = Math.max(0, Math.min(items.length - 1, i));
    const r = track.getBoundingClientRect();
    const b = items[i].getBoundingClientRect();
    track.scrollBy({ left: b.left + b.width / 2 - (r.left + r.width / 2), behavior: reduce ? "auto" : "smooth" });
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  track.addEventListener("scroll", () => {
    clearTimeout(timer);
    timer = setTimeout(() => onChange(idx()), 60);
  }, { passive: true });

  return { go, idx, n: items.length };
}
