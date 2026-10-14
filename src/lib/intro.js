// Controls the first-visit loader (markup + styles live inline in index.html so it paints
// before any JS). It lifts once fonts and the first hero image are ready — never longer than
// MAX_MS — and resolves `introDone` so the hero can start its entrance choreography.

const MIN_MS = 1100;
const MAX_MS = 2600;

let resolveDone;
export const introDone = new Promise((r) => { resolveDone = r; });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const decode = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    if (img.decode) img.decode().then(resolve, resolve);
    else { img.onload = resolve; img.onerror = resolve; }
  });

export function runIntro() {
  const el = document.getElementById('ms-loader');
  const skip = !el || document.documentElement.classList.contains('ms-skip-intro');
  if (skip) {
    el?.remove();
    resolveDone();
    return;
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('ms-intro-pending');
  const isHome = window.location.pathname === '/';
  const assets = [document.fonts?.ready ?? Promise.resolve()];
  if (isHome) assets.push(decode(window.innerWidth < 760 ? '/img/r/hero-living-sm.webp' : '/img/r/hero-living.webp'));
  const started = performance.now();
  const ready = Promise.race([Promise.all(assets), wait(MAX_MS)]);

  ready.then(async () => {
    const elapsed = performance.now() - started;
    await wait(Math.max(0, (reduced ? 300 : MIN_MS) - elapsed));
    el.classList.add('is-ready');
    await wait(reduced ? 0 : 380);
    el.classList.add('is-leaving');
    try { sessionStorage.setItem('ms:intro', '1'); } catch { /* ignore */ }
    // Start the hero entrance while the curtain is still lifting, so the two overlap.
    setTimeout(() => {
      resolveDone();
      document.documentElement.classList.remove('ms-intro-pending');
    }, reduced ? 0 : 450);
    setTimeout(() => el.remove(), reduced ? 50 : 1100);
  });
}
