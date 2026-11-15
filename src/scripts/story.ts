export function initStory() {
  // ── Mission clock: follow the chapter in view.
  const hud = document.querySelector<HTMLElement>('[data-hud]');
  const set = (sel: string, v: string) => { const el = hud?.querySelector(sel); if (el) el.textContent = v; };
  const toc = document.querySelectorAll<HTMLAnchorElement>('[data-toc]');
  const chapters = document.querySelectorAll<HTMLElement>('[data-chapter]');
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const c = JSON.parse((en.target as HTMLElement).dataset.chapter || '{}');
      set('[data-hud-ch]', `${c.n} · ${c.title}`);
      set('[data-hud-sol]', c.hud.sol); set('[data-hud-date]', c.hud.date); set('[data-hud-place]', c.hud.place);
      if (hud) hud.dataset.state = c.id === 'legacy' ? 'lost' : c.id === 'final' ? 'weak' : 'live';
      toc.forEach((a) => a.classList.toggle('is-active', a.dataset.toc === c.id));
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
