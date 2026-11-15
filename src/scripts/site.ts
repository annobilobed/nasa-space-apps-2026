import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

function header() {
  const h = document.querySelector<HTMLElement>('[data-header]');
  if (!h) return;
  let last = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    h.classList.toggle('is-solid', y > 40);
    const menuOpen = h.querySelector('[data-menu-btn]')?.getAttribute('aria-expanded') === 'true';
    const focusInside = h.contains(document.activeElement);
    h.classList.toggle('is-hidden', y > 400 && y > last + 4 && !menuOpen && !focusInside);
    if (y < last - 4) h.classList.remove('is-hidden');
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function menu() {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
  const panel = document.querySelector<HTMLElement>('[data-menu]');
  if (!btn || !panel) return;
  const set = (open: boolean) => {
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.querySelector('[data-header]')?.classList.toggle('is-solid', open || window.scrollY > 40);
    if (open) { lenis?.stop(); panel.querySelector<HTMLAnchorElement>('a')?.focus(); } else { lenis?.start(); }
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => e.matches && set(false));
}

function reveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window) || reducedMotion()) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((e) => io.observe(e));
}

function counters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  const fmt = (el: HTMLElement, v: number) => {
    const dec = Number(el.dataset.decimals ?? 0);
    el.textContent = v.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  };
  if (reducedMotion() || !('IntersectionObserver' in window)) { els.forEach((el) => fmt(el, Number(el.dataset.count))); return; }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target as HTMLElement; io.unobserve(el);
      const target = Number(el.dataset.count); const t0 = performance.now(); const dur = 1600;
      const step = (t: number) => { const p = Math.min(1, (t - t0) / dur); fmt(el, target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.4 });
  els.forEach((el) => io.observe(el));
}

function smooth() {
  if (reducedMotion()) return;
  lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -80 } });
  const raf = (t: number) => { lenis?.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  window.dispatchEvent(new CustomEvent('airxon:lenis', { detail: lenis }));
}

function parallax() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!els.length || reducedMotion()) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    for (const el of els) {
      const r = el.parentElement!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 … 1
      el.style.transform = `translate3d(0, ${(-p * Number(el.dataset.parallax || 8)).toFixed(2)}%, 0)`;
    }
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// Clicking a link to the page you are already on (Home, the logo) returns to the top
// instead of reloading at the same scroll position.
function samePageTop() {
  const here = (u: URL) => u.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || here(url) !== here(new URL(location.href)) || url.hash) return;
    e.preventDefault();
    // close the mobile menu if it is open
    const btn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
    if (btn?.getAttribute('aria-expanded') === 'true') btn.click();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 }); else window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  });
}

// Every page opens at the top: after a menu click, a refresh or the browser's back/forward
// buttons. The only exception is a link to a section on the page (#id that exists).
function startAtTop() {
  try { history.scrollRestoration = 'manual'; } catch { /* unsupported */ }
  const targetsSection = () => { const h = decodeURIComponent(location.hash.slice(1)); return !!h && !!document.getElementById(h); };
  const toTop = () => {
    if (targetsSection()) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  };
  toTop();
  window.addEventListener('load', toTop, { once: true });
  window.addEventListener('pageshow', (e) => { if ((e as PageTransitionEvent).persisted) toTop(); });
}

export function initSite() {
  samePageTop();
  smooth(); startAtTop(); header(); menu(); reveals(); counters(); parallax();
}
