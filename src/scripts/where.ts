interface D { name: string; short: string; world: string; mission: string; purpose: string; history: string; status: string; statusLabel: string; coord: string; precision: string; precisionLabel: string; place: string; note: string; launch: string; srcTitle: string; srcUrl: string }

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

function panZoom(frame: HTMLElement) {
  const stage = frame.querySelector<HTMLElement>('[data-stage]')!;
  let z = 1, x = 0, y = 0;
  const clamp = () => {
    const w = frame.clientWidth, h = frame.clientHeight;
    x = Math.min(0, Math.max(w - w * z, x)); y = Math.min(0, Math.max(h - h * z, y));
  };
  const render = () => {
    clamp(); stage.style.transform = `translate(${x}px, ${y}px) scale(${z})`; stage.style.setProperty('--z', String(z));
    frame.style.touchAction = z > 1 ? 'none' : 'pan-y'; // let the page scroll until the map is zoomed
  };
  const zoomAt = (nz: number, cx = frame.clientWidth / 2, cy = frame.clientHeight / 2) => {
    nz = Math.min(8, Math.max(1, nz));
    x = cx - ((cx - x) * nz) / z; y = cy - ((cy - y) * nz) / z; z = nz; render();
  };
  const focus = (px: number, py: number, nz = 4) => { // px, py as 0 to 1 fractions of the map
    z = nz; x = frame.clientWidth / 2 - px * frame.clientWidth * z; y = frame.clientHeight / 2 - py * frame.clientHeight * z; render();
  };
  // One finger (or the mouse) drags; two fingers pinch to zoom; double-tap or double-click zooms in.
  const pts = new Map<number, { x: number; y: number }>();
  let drag: { sx: number; sy: number; ox: number; oy: number } | null = null;
  let pinch: { d: number; z: number } | null = null;
  let lastTap = 0;
  const local = (e: PointerEvent) => { const r = frame.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const startDrag = () => { const p = [...pts.values()][0]; drag = p ? { sx: p.x, sy: p.y, ox: x, oy: y } : null; };
  const pinchInfo = () => { const [a, b] = [...pts.values()]; return { d: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }; };
  frame.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('.pin')) return;
    pts.set(e.pointerId, local(e));
    try { frame.setPointerCapture(e.pointerId); } catch { /* synthetic or already-released pointer */ }
    frame.classList.add('dragging');
    if (pts.size === 2) { drag = null; pinch = { d: pinchInfo().d, z }; frame.style.touchAction = 'none'; }
    else if (pts.size === 1) {
      startDrag();
      if (e.pointerType === 'touch') {
        const now = performance.now();
        if (now - lastTap < 300) { const p = local(e); zoomAt(z * 2, p.x, p.y); lastTap = 0; } else lastTap = now;
      }
    }
  });
  frame.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, local(e));
    if (pinch && pts.size >= 2) { const i = pinchInfo(); zoomAt(pinch.z * (i.d / pinch.d), i.cx, i.cy); return; }
    if (drag) { const p = [...pts.values()][0]; x = drag.ox + p.x - drag.sx; y = drag.oy + p.y - drag.sy; render(); }
  });
  const end = (e: PointerEvent) => {
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (pts.size === 1) startDrag();
    if (!pts.size) { drag = null; frame.classList.remove('dragging'); render(); }
  };
  frame.addEventListener('pointerup', end); frame.addEventListener('pointercancel', end);
  frame.addEventListener('dblclick', (e) => {
    if ((e.target as HTMLElement).closest('.pin')) return;
    const r = frame.getBoundingClientRect(); zoomAt(z * 2, e.clientX - r.left, e.clientY - r.top);
  });
  frame.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 1) return;
    e.preventDefault();
    const r = frame.getBoundingClientRect();
    zoomAt(z * (e.deltaY < 0 ? 1.25 : 0.8), e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
  new ResizeObserver(render).observe(frame);
  return { zoomIn: () => zoomAt(z * 1.5), zoomOut: () => zoomAt(z / 1.5), reset: () => { z = 1; x = 0; y = 0; render(); }, focus };
}

export function initWhere() {
  const root = document.querySelector<HTMLElement>('[data-explorer]');
  if (!root) return;
  const data: Record<string, D> = JSON.parse(document.getElementById('where-data')?.textContent || '{}');
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
  const maps = new Map<string, ReturnType<typeof panZoom>>();

  panels.forEach((p) => {
    const frame = p.querySelector<HTMLElement>('[data-map]');
    if (!frame) return;
    const pz = panZoom(frame);
    maps.set(p.dataset.panel!, pz);
    p.querySelector('[data-zoom="in"]')?.addEventListener('click', pz.zoomIn);
    p.querySelector('[data-zoom="out"]')?.addEventListener('click', pz.zoomOut);
    p.querySelector('[data-zoom="reset"]')?.addEventListener('click', pz.reset);
  });

  const showTab = (key: string, focus = false) => {
    tabs.forEach((t) => { const on = t.dataset.tab === key; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    panels.forEach((p) => (p.hidden = p.dataset.panel !== key));
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { showTab(t.dataset.tab!); history.replaceState(null, '', `#${t.dataset.tab}`); });
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      showTab(n.dataset.tab!, true);
    });
  });

  const select = (slug: string, zoom = true) => {
    const d = data[slug];
    if (!d || d.world === 'deep-space') return;
    showTab(d.world);
    const panel = root.querySelector<HTMLElement>(`[data-panel="${d.world}"]`)!;
    panel.querySelectorAll('.pin').forEach((p) => p.classList.toggle('is-active', (p as HTMLElement).dataset.pin!.split(' ').includes(slug)));
    panel.querySelectorAll<HTMLButtonElement>('[data-select]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.select === slug)));
    const pin = panel.querySelector<HTMLElement>(`.pin[data-pin~="${slug}"]`);
    const siblings = pin ? pin.dataset.pin!.split(' ').filter((s) => s !== slug) : [];
    const det = panel.querySelector<HTMLElement>('[data-detail]')!;
    det.innerHTML = `
      <p class="d-meta">${esc(d.mission)} · launched ${esc(d.launch)}</p>
      <h3>${esc(d.name)}</h3>
      <span class="status" data-s="${d.status}">${esc(d.statusLabel)}</span>
      <p class="d-coord">${esc(d.coord)}</p>
      <p class="d-prec"><b class="${d.precision}">${esc(d.precisionLabel)}</b> · ${esc(d.place)}</p>
      ${d.note ? `<p>${esc(d.note)}</p>` : ''}
      <p><strong>Purpose:</strong> ${esc(d.purpose)}</p>
      <p><strong>What happened:</strong> ${esc(d.history)}</p>
      ${d.srcUrl ? `<p class="d-prec">Coordinate source: <a href="${esc(d.srcUrl)}" rel="noopener">${esc(d.srcTitle)}</a></p>` : ''}
      ${siblings.length ? `<div class="d-also"><span>Also at this site:</span>${siblings.map((s) => `<button type="button" class="chip" data-also="${s}">${esc(data[s].short)}</button>`).join('')}</div>` : ''}
      <a class="btn btn-secondary btn-sm" href="${profileHref(slug)}">Open full profile</a>`;
    det.querySelectorAll<HTMLButtonElement>('[data-also]').forEach((b) => b.addEventListener('click', () => select(b.dataset.also!, false)));
    if (zoom && pin) {
      const left = parseFloat(pin.style.left) / 100, top = parseFloat(pin.style.top) / 100;
      maps.get(d.world)?.focus(left, top, 3);
    }
  };
  // Profile links: derive the base from the home link so portable (sub-folder) builds resolve.
  const profileHref = (slug: string) => {
    const home = document.querySelector<HTMLAnchorElement>('.brand')?.getAttribute('href') || '/';
    return home === '/' ? `/archive/${slug}/` : `${home.replace(/index\.html$/, '')}archive/${slug}.html`;
  };

  root.querySelectorAll<HTMLElement>('.pin').forEach((p) => p.addEventListener('click', () => select(p.dataset.pin!.split(' ')[0], false)));
  root.querySelectorAll<HTMLButtonElement>('[data-select]').forEach((b) => b.addEventListener('click', () => select(b.dataset.select!)));

  const fromHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;
    if (h === 'moon' || h === 'mars' || h === 'deep') return showTab(h);
    if (h === 'deep-space') return showTab('deep');
    if (data[h]) data[h].world === 'deep-space' ? showTab('deep') : select(h);
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
}
