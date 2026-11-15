export function initMuseum() {
  const data = JSON.parse(document.getElementById('museum-data')?.textContent || '{}');
  const chips = [...document.querySelectorAll<HTMLButtonElement>('[data-mf]')];
  const exhibits = [...document.querySelectorAll<HTMLElement>('[data-tags]')];
  const halls = [...document.querySelectorAll<HTMLElement>('[data-hall]')];
  const count = document.querySelector('[data-mf-count]');
  const apply = (key: string) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.mf === key)));
    let n = 0;
    exhibits.forEach((ex) => { const on = ex.dataset.tags!.split(' ').includes(key); ex.hidden = !on; if (on) n++; });
    halls.forEach((h) => (h.hidden = !h.querySelector('[data-tags]:not([hidden])')));
    if (count) count.textContent = `${n} ${n === 1 ? 'exhibit' : 'exhibits'}`;
  };
  chips.forEach((c) => c.addEventListener('click', () => {
    apply(c.dataset.mf!);
    document.querySelector('[data-hall]:not([hidden])')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  const dlg = document.querySelector<HTMLDialogElement>('[data-panel]');
  if (!dlg) return;
  const q = (k: string) => dlg.querySelector<HTMLElement>(`[data-p="${k}"]`)!;
  let opener: HTMLElement | null = null;
  document.querySelectorAll<HTMLAnchorElement>('[data-exhibit]').forEach((a) => a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let new-tab clicks through
    const d = data[a.dataset.exhibit!];
    if (!d) return;
    e.preventDefault();
    opener = a;
    (q('img') as HTMLImageElement).src = resolve(a, d.img);
    (q('img') as HTMLImageElement).alt = d.alt;
    q('credit').textContent = d.credit;
    q('meta').textContent = `${d.world} · ${d.type} · Launched ${d.launch}`;
    q('name').textContent = d.name;
    q('status').textContent = d.statusLabel; q('status').dataset.s = d.status;
    q('summary').textContent = d.summary; q('purpose').textContent = d.purpose;
    q('discovery').textContent = d.discovery; q('statusNote').textContent = d.statusNote;
    (q('link') as HTMLAnchorElement).href = a.href;
    dlg.showModal();
    dlg.scrollTop = 0;
  }));
  dlg.querySelector('[data-panel-close]')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => opener?.focus());
}

// Resolve a root-relative media path the same way the page's own <img> tags do,
// so the panel works both on a domain root and from a portable sub-folder build.
function resolve(anchor: HTMLAnchorElement, path: string) {
  const img = anchor.querySelector('img');
  if (!img) return path;
  const base = img.getAttribute('src') || '';
  const i = base.indexOf('media/');
  return i >= 0 ? base.slice(0, i) + path.replace(/^\//, '') : path;
}
