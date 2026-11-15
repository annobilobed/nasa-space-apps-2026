export function initStory() {
  // ── Mission clock: follow the chapter in view.
  const hud = document.querySelector<HTMLElement>('[data-hud]');
  const set = (sel: string, v: string) => { const el = hud?.querySelector(sel); if (el) el.textContent = v; };
  const toc = document.querySelectorAll<HTMLAnchorElement>('[data-toc]');
  const chapters = document.querySelectorAll<HTMLElement>('[data-chapter]');
  // On phones the chapter rail is a sticky, swipeable row under the mission clock:
  // keep it just below the clock, and keep the current chapter's chip in view.
  const rail = document.querySelector<HTMLElement>('.toc');
  if (hud) new ResizeObserver(() => document.documentElement.style.setProperty('--hud-h', `${hud.offsetHeight}px`)).observe(hud);
  const centreChip = (id: string) => {
    if (!rail || rail.scrollWidth <= rail.clientWidth) return;
    const a = [...toc].find((x) => x.dataset.toc === id);
    if (a) rail.scrollTo({ left: a.offsetLeft - (rail.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
  };
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const c = JSON.parse((en.target as HTMLElement).dataset.chapter || '{}');
      set('[data-hud-ch]', `${c.n} · ${c.title}`);
      set('[data-hud-sol]', c.hud.sol); set('[data-hud-date]', c.hud.date); set('[data-hud-place]', c.hud.place);
      if (hud) hud.dataset.state = c.id === 'legacy' ? 'lost' : c.id === 'final' ? 'weak' : 'live';
      toc.forEach((a) => a.classList.toggle('is-active', a.dataset.toc === c.id));
      centreChip(c.id);
    }
  }, { rootMargin: '-35% 0px -55% 0px' });
  chapters.forEach((c) => io.observe(c));
  // Above the first chapter (hero visible), show chapter I again.
  const hero = document.querySelector('.s-hero');
  if (hero && chapters[0]) new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    const c = JSON.parse(chapters[0].dataset.chapter || '{}');
    set('[data-hud-ch]', `${c.n} · ${c.title}`); set('[data-hud-sol]', c.hud.sol); set('[data-hud-date]', c.hud.date); set('[data-hud-place]', c.hud.place);
    if (hud) hud.dataset.state = 'live';
    toc.forEach((a) => a.classList.remove('is-active'));
  }, { threshold: 0.3 }).observe(hero);

  // ── Timeline (ARIA tabs pattern).
  const tl = document.querySelector<HTMLElement>('[data-timeline]');
  if (tl) {
    const tabs = [...tl.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const items = [...tl.querySelectorAll<HTMLElement>('[data-item]')];
    const count = tl.querySelector('[data-tl-count]');
    const panel = tl.querySelector<HTMLElement>('[data-tl-panel]');
    let cur = 0;
    const select = (i: number, focus = false) => {
      cur = (i + tabs.length) % tabs.length;
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(j === cur)); t.tabIndex = j === cur ? 0 : -1; });
      items.forEach((it, j) => (it.hidden = j !== cur));
      panel?.setAttribute('aria-labelledby', tabs[cur].id);
      if (count) count.textContent = `${cur + 1} / ${tabs.length}`;
      tabs[cur].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      if (focus) tabs[cur].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); select(cur + 1, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select(cur - 1, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });
    // Swipe on the moment's picture to step along the line (arrow keys do this on a laptop).
    let sx = 0, sy = 0, sw = false;
    panel?.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; sx = e.clientX; sy = e.clientY; sw = true; });
    panel?.addEventListener('pointerup', (e) => {
      if (!sw) return; sw = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) select(cur + (dx < 0 ? 1 : -1));
    });
    panel?.addEventListener('pointercancel', () => (sw = false));
    if (panel) panel.style.touchAction = 'pan-y';
    tl.querySelector('[data-tl-prev]')?.addEventListener('click', () => select(cur - 1));
    tl.querySelector('[data-tl-next]')?.addEventListener('click', () => select(cur + 1));
    select(0);
  }

  // ── Tau explorer: direct-beam transmission e^(−tau).
  const input = document.querySelector<HTMLInputElement>('[data-tau-input]');
  const out = document.querySelector<HTMLOutputElement>('[data-tau-out]');
  const sky = document.querySelector<HTMLElement>('[data-tau-sky]');
  if (input && out && sky) {
    const update = () => {
      const tau = Number(input.value);
      const t = Math.exp(-tau);
      const pct = t * 100;
      const txt = pct >= 1 ? `${pct.toFixed(0)}%` : pct >= 0.01 ? `${pct.toFixed(2)}%` : `${pct.toFixed(4)}%`;
      out.textContent = `tau ${tau.toFixed(1)} · ${txt} of direct sunlight gets through${tau >= 10.7 ? '. This was Opportunity’s last day' : ''}`;
      // perceptual brightness for the illustration (not physically scaled)
      sky.style.setProperty('--light', String(Math.max(0.04, Math.pow(t, 0.35))));
    };
    input.addEventListener('input', update);
    update();
  }
}
