// Theatre player: one <video> per film, one set of custom controls that always
// drives the active film. Handles loading, errors, captions and full screen.
const fmt = (s: number) => { if (!isFinite(s) || s < 0) return '0:00'; const m = Math.floor(s / 60); return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`; };

export function initPlayer() {
  const root = document.querySelector<HTMLElement>('[data-player]');
  if (!root) return;
  const videos = [...root.querySelectorAll<HTMLVideoElement>('[data-video]')];
  if (!videos.length) return;
  const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const play = q<HTMLButtonElement>('[data-play]'), big = q<HTMLButtonElement>('[data-big-play]');
  const seek = q<HTMLInputElement>('[data-seek]'), time = q<HTMLElement>('[data-time]');
  const mute = q<HTMLButtonElement>('[data-mute]'), cc = q<HTMLButtonElement>('[data-cc]'), fs = q<HTMLButtonElement>('[data-fs]');
  const loading = q<HTMLElement>('[data-loading]'), error = q<HTMLElement>('[data-error]');
  let v = videos[0], seeking = false, captionsOn = true;
  // Captions are embedded in the page and attached as blob: URLs, so they work on any host.
  root.querySelectorAll<HTMLTrackElement>('track[data-vtt]').forEach((t) => {
    const txt = document.querySelector(`[data-vtt-text="${t.dataset.vtt}"]`)?.textContent;
    if (txt) t.src = URL.createObjectURL(new Blob([txt], { type: 'text/vtt' }));
  });

  const sync = () => {
    root.classList.toggle('is-playing', !v.paused && !v.ended);
    play.setAttribute('aria-label', v.paused ? 'Play' : 'Pause');
    big.setAttribute('aria-label', v.paused ? 'Play' : 'Pause');
    time.textContent = `${fmt(v.currentTime)} / ${fmt(v.duration)}`;
    if (!seeking) seek.value = String(v.duration ? Math.round((v.currentTime / v.duration) * 1000) : 0);
    seek.setAttribute('aria-valuetext', `${fmt(v.currentTime)} of ${fmt(v.duration)}`);
  };
  const applyCaptions = () => {
    const t = v.textTracks[0];
    cc.disabled = !t;
    if (t) t.mode = captionsOn ? 'showing' : 'hidden';
    cc.setAttribute('aria-pressed', String(captionsOn && !!t));
  };
  const toggle = () => {
    if (v.paused || v.ended) {
      root.classList.add('has-started');
      const p = v.play();
      if (p) p.catch(() => { root.classList.remove('has-started'); sync(); });
    } else v.pause();
  };

  videos.forEach((el) => {
    ['play', 'pause', 'timeupdate', 'loadedmetadata', 'durationchange', 'ended'].forEach((e) => el.addEventListener(e, () => el === v && sync()));
    el.addEventListener('waiting', () => { if (el === v) loading.hidden = false; });
    ['playing', 'canplay', 'pause'].forEach((e) => el.addEventListener(e, () => { if (el === v) loading.hidden = true; }));
    el.addEventListener('error', () => { if (el === v) { error.hidden = false; loading.hidden = true; } }, true);
    // Only the last <source> failing means nothing could play (earlier ones may fail over to WebM).
    [...el.querySelectorAll('source')].pop()?.addEventListener('error', () => { if (el === v) { error.hidden = false; loading.hidden = true; } });
    el.addEventListener('click', toggle);
    el.muted = mute.getAttribute('aria-pressed') === 'true';
  });

  const select = (slug: string, autoplay = false) => {
    const next = videos.find((x) => x.dataset.film === slug);
    if (!next) return;
    if (next !== v) {
      v.pause();
      videos.forEach((x) => (x.hidden = x !== next));
      v = next;
      v.muted = mute.getAttribute('aria-pressed') === 'true';
      if (v.preload === 'none') { v.preload = 'metadata'; v.load(); }
      root.classList.remove('has-started');
      error.hidden = true;
      const link = error.querySelector<HTMLAnchorElement>('[data-error-link]');
      const s = v.querySelector('source');
      if (link && s) link.href = s.src;
    }
    document.querySelectorAll<HTMLElement>('[data-now]').forEach((n) => (n.hidden = n.dataset.now !== slug));
    document.querySelectorAll<HTMLButtonElement>('[data-select-film]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.selectFilm === slug)));
    applyCaptions(); sync();
    if (autoplay) toggle();
  };

  play.addEventListener('click', toggle);
  big.addEventListener('click', toggle);
  seek.addEventListener('input', () => { seeking = true; if (v.duration) v.currentTime = (Number(seek.value) / 1000) * v.duration; });
  seek.addEventListener('change', () => (seeking = false));
  mute.addEventListener('click', () => {
    const m = !v.muted; videos.forEach((x) => (x.muted = m));
    mute.setAttribute('aria-pressed', String(m)); mute.setAttribute('aria-label', m ? 'Unmute' : 'Mute');
  });
  cc.addEventListener('click', () => { captionsOn = !captionsOn; applyCaptions(); });
  fs.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (root.requestFullscreen) await root.requestFullscreen();
      else (v as any).webkitEnterFullscreen?.();
    } catch { /* full screen refused: keep playing inline */ }
  });
  root.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); toggle(); }
    if (e.key === 'ArrowRight') v.currentTime += 5;
    if (e.key === 'ArrowLeft') v.currentTime -= 5;
    if (e.key === 'f') fs.click();
  });
  document.querySelectorAll<HTMLButtonElement>('[data-select-film]').forEach((b) => b.addEventListener('click', () => {
    select(b.dataset.selectFilm!, true);
    root.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-chapter]').forEach((b) => b.addEventListener('click', () => {
    select(b.dataset.chapterFilm!);
    const go = () => { v.currentTime = Number(b.dataset.chapter); if (v.paused) toggle(); };
    if (v.readyState >= 1) go(); else v.addEventListener('loadedmetadata', go, { once: true });
    root.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
  // Text tracks load lazily; re-apply once each is ready.
  videos.forEach((el) => el.querySelector('track')?.addEventListener('load', () => el === v && applyCaptions()));
  select(videos[0].dataset.film!);
  // Arriving from a "Watch the documentary" link (#watch): the film is selected, the play button is focused and pulses.
  if (location.hash === '#watch') {
    root.classList.add('is-cued');
    const cue = () => { root.scrollIntoView({ block: 'center' }); big.focus({ preventScroll: true }); };
    requestAnimationFrame(cue);
    window.addEventListener('load', () => setTimeout(cue, 50), { once: true });
  }
}
