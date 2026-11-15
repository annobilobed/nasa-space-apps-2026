import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis, reducedMotion } from './site';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.clearScrollMemory('manual');

// Frame layout of the journey film (scripts/render-journey.py).
const NA = 48, NB = 120, NC = 36, ND = 96, FRAMES = NA + NB + NC + ND, FPS = 30;

export function initHome() {
  const root = document.documentElement;
  const reduce = reducedMotion();

  // Keep ScrollTrigger in step with Lenis smooth scrolling.
  const hook = (l: any) => { l?.on?.('scroll', ScrollTrigger.update); };
  hook(getLenis());
  window.addEventListener('airxon:lenis', (e) => hook((e as CustomEvent).detail));

  // ── Opening sequence (≈2.6 s). Links are focusable from the first frame and
  //    the sequence never blocks input; any interaction finishes it instantly.
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => root.classList.remove('intro-pending') });
  if (reduce) {
    root.classList.remove('intro-pending');
  } else {
    intro
      .fromTo('[data-intro="planet"]', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 2.2, ease: 'power2.out' }, 0.1)
      .fromTo('[data-intro="brand"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9 }, 0.5)
      .fromTo('[data-intro="headline"] .w > span', { yPercent: 115, y: 0 }, { yPercent: 0, y: 0, duration: 1.0, stagger: 0.055 }, 0.75)
      .fromTo('[data-intro="sub"]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, 1.45)
      .fromTo('[data-intro="cta"] > *', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 1.65)
      .fromTo('[data-intro="meta"]', { opacity: 0 }, { opacity: 1, duration: 1 }, 2.0);
    root.classList.remove('intro-pending'); // fromTo() has rendered its start state
    const finish = () => { if (intro.progress() < 1) intro.progress(1); };
    ['wheel', 'keydown', 'touchstart', 'pointerdown'].forEach((ev) => window.addEventListener(ev, finish, { once: true, passive: true }));
  }

  // ── Featured hardware rail buttons.
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  document.querySelectorAll<HTMLButtonElement>('[data-rail-btn]').forEach((b) =>
    b.addEventListener('click', () => rail?.scrollBy({ left: (b.dataset.railBtn === 'next' ? 1 : -1) * rail.clientWidth * 0.8, behavior: 'smooth' })),
  );

  if (reduce) return;

  const scene = document.querySelector<HTMLElement>('[data-journey]');
  const video = document.querySelector<HTMLVideoElement>('[data-journey-video]');
  const marker = document.querySelector<HTMLElement>('[data-crater-marker]');
  const vwOut = document.querySelector<HTMLElement>('[data-vw]');
  if (!scene || !video) return;

  // Portrait screens get the portrait render of the same film.
  const portrait = window.innerHeight > window.innerWidth * 1.1;
  if (portrait) {
    video.poster = video.poster.replace('landscape', 'portrait');
    video.querySelectorAll('source').forEach((s) => (s.src = s.src.replace('landscape', 'portrait')));
    video.load();
  }
  const FW = portrait ? 720 : 1280, FH = portrait ? 1280 : 720, S = Math.min(FW, FH);
  video.addEventListener('loadeddata', () => video.classList.add('is-ready'), { once: true });
  if (video.readyState >= 2) video.classList.add('is-ready');

  // Same camera curve as the renderer, for the live "viewing width" readout.
  const R_MARS = 3389.5e3;
  const A0R = portrait ? 0.7 * FW : 0.69 * FH, A1R = 0.4 * S, R1 = (R_MARS / 55) * (S / 720);
  const ease = (t: number) => { t = Math.min(Math.max(t, 0), 1); return t * t * (3 - 2 * t); };
  const rpx = (f: number) => f < NA
    ? Math.exp(Math.log(A0R) + (Math.log(A1R) - Math.log(A0R)) * ease(f / (NA - 1)))
    : Math.exp(Math.log(A1R) + (Math.log(R1) - Math.log(A1R)) * ease((f - NA) / (NB - 1)));
  const widthKm = (f: number) => (FW * R_MARS) / rpx(Math.min(f, NA + NB - 1)) / 1000;

  // Endeavour's western rim, measured on the last orbital frame (frame px from centre).
  const OPP = { dx: -214, dy: 20 };
  const placeMarker = () => {
    if (!marker) return;
    const W = scene.clientWidth, H = scene.clientHeight, sc = Math.max(W / FW, H / FH); // object-fit: cover
    marker.style.left = `${W / 2 + OPP.dx * sc}px`;
    marker.style.top = `${H / 2 + OPP.dy * sc}px`;
  };
  placeMarker();
  window.addEventListener('resize', placeMarker);

  // The playhead chases the scroll position (video is all-intra, so every seek is instant).
  let target = 0, shown = -1;
  const tick = () => {
    requestAnimationFrame(tick);
    if (video.readyState < 1) return;
    const dur = video.duration || FRAMES / FPS;
    const t = Math.min(dur - 0.001, target * dur);
    if (Math.abs(t - shown) > 0.5 / FPS) { video.currentTime = t; shown = t; }
  };
  requestAnimationFrame(tick);
  const unlock = () => { const p = video.play(); if (p) p.then(() => video.pause()).catch(() => {}); };
  window.addEventListener('touchstart', unlock, { once: true, passive: true });

  // One timeline in frame units: the film and every overlay share the same clock.
  const HOLD = 30; // a short hold on the final message
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: scene, start: 'top top', end: () => `+=${window.innerHeight * 10}`, scrub: 0.5, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
  });
  const film = { f: 0 };
  tl.to(film, { f: FRAMES - 1, duration: FRAMES - 1, onUpdate: () => {
      target = film.f / (FRAMES - 1);
      if (vwOut) vwOut.textContent = `${Math.round(widthKm(film.f)).toLocaleString('en-GB')} km`;
    } }, 0)
    .to(['[data-hero-copy]', '[data-hero-meta]'], { autoAlpha: 0, y: -40, duration: 30 }, 0)
    .fromTo('[data-descent-hud]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 12 }, 40)
    .fromTo('[data-descent-line="1"]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 18 }, 58)
    .to('[data-descent-line="1"]', { autoAlpha: 0, y: -30, duration: 15 }, 118)
    .fromTo('[data-descent-line="crater"]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 12 }, 146)
    .fromTo(marker, { autoAlpha: 0 }, { autoAlpha: 1, duration: 8 }, 155)
    .to(['[data-descent-line="crater"]', marker, '[data-descent-hud]'], { autoAlpha: 0, duration: 8 }, NA + NB + 2)
    .fromTo('[data-pano-cap]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 14 }, NA + NB + NC + 2)
    .fromTo('[data-j-credit]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 14 }, NA + NB + NC + 2)
    .fromTo('[data-descent-line="2"]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 14 }, NA + NB + NC + 4)
    .to('[data-descent-line="2"]', { autoAlpha: 0, duration: 10 }, FRAMES - 26)
    .to('[data-j-scrim]', { autoAlpha: 0.55, duration: 12 }, FRAMES - 16)
    .fromTo('[data-descent-line="3"]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 14 }, FRAMES - 14)
    .to({}, { duration: HOLD }, FRAMES);

  // "Begin the descent": glide to the moment the planet reaches the centre.
  document.querySelector('[data-scroll-cue]')?.addEventListener('click', () => {
    const st = tl.scrollTrigger!;
    const y = st.start + (st.end - st.start) * ((NA + 30) / (FRAMES + HOLD));
    const l = getLenis();
    if (l) l.scrollTo(y, { duration: 2.2 }); else window.scrollTo({ top: y, behavior: 'smooth' });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
