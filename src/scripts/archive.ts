interface Rec { slug: string; name: string; short: string; world: string; category: string; status: string; era: string; agency: string; launch: string; text: string }

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9.\s-]/g, ' ');

export function initArchive() {
  const root = document.querySelector<HTMLElement>('[data-archive]');
  const dataEl = document.getElementById('archive-data');
  if (!root || !dataEl) return;
  const recs: Rec[] = JSON.parse(dataEl.textContent || '[]');
  const index = recs.map((r) => ({ r, name: norm(`${r.name} ${r.short}`), body: norm(r.text) }));
  const list = root.querySelector<HTMLElement>('[data-results]')!;
  const items = new Map([...list.querySelectorAll<HTMLElement>('li[data-slug]')].map((li) => [li.dataset.slug!, li]));
  const q = root.querySelector<HTMLInputElement>('[data-q]')!;
  const selects = [...root.querySelectorAll<HTMLSelectElement>('[data-f]')];
  const sort = root.querySelector<HTMLSelectElement>('[data-sort]')!;
  const chips = [...root.querySelectorAll<HTMLButtonElement>('[data-status]')];
  const out = root.querySelector('[data-count-out]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  const form = root.querySelector('form');
  form?.addEventListener('submit', (e) => e.preventDefault());
  let status = '';

  const score = (entry: (typeof index)[number], terms: string[]) => {
    let s = 0;
    for (const t of terms) {
      const inName = entry.name.includes(t);
      const re = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
      const inBody = re.test(entry.body);
      if (!inName && !inBody) return -1; // every term must match somewhere
      s += (inName ? 10 : 0) + (inBody ? 3 : 0);
    }
    return s;
  };

  const apply = () => {
    const terms = norm(q.value).split(/\s+/).filter(Boolean);
    const f = Object.fromEntries(selects.map((s) => [s.dataset.f!, s.value]));
    let rows = index
      .map((e, i) => ({ ...e, i, s: terms.length ? score(e, terms) : 0 }))
      .filter((e) => e.s >= 0 && (!status || e.r.status === status) && Object.entries(f).every(([k, v]) => !v || (e.r as any)[k] === v));
    const mode = sort.value;
    rows.sort((a, b) =>
      mode === 'launch-asc' ? a.r.launch.localeCompare(b.r.launch)
      : mode === 'launch-desc' ? b.r.launch.localeCompare(a.r.launch)
      : mode === 'name' ? a.r.short.localeCompare(b.r.short)
      : b.s - a.s || a.i - b.i);
    const shown = new Set(rows.map((e) => e.r.slug));
    items.forEach((li, slug) => (li.hidden = !shown.has(slug)));
    rows.forEach((e) => list.appendChild(items.get(e.r.slug)!)); // reorder
    out.textContent = `${rows.length} ${rows.length === 1 ? 'machine' : 'machines'}${terms.length ? ` matching “${q.value.trim()}”` : ''}`;
    empty.hidden = rows.length > 0;
    save();
  };

  const setStatus = (s: string) => {
    status = s;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.status === s)));
    apply();
  };
  chips.forEach((c) => c.addEventListener('click', () => setStatus(c.dataset.status || '')));
  let t = 0;
  q.addEventListener('input', () => { clearTimeout(t); t = window.setTimeout(apply, 120); });
  selects.forEach((s) => s.addEventListener('change', apply));
  sort.addEventListener('change', apply);
  root.querySelectorAll('[data-reset]').forEach((b) => b.addEventListener('click', () => {
    q.value = ''; selects.forEach((s) => (s.value = '')); sort.value = 'relevance'; setStatus(''); q.focus();
  }));

  root.querySelectorAll<HTMLButtonElement>('[data-suggest]').forEach((b) => b.addEventListener('click', () => { q.value = b.dataset.suggest!; apply(); q.focus(); }));

  // Remember filters for this tab so "back" from a profile restores the view.
  const KEY = 'airxon-archive';
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify({ q: q.value, s: status, sort: sort.value, f: selects.map((x) => x.value) })); } catch { /* storage unavailable */ } };
  const restore = () => {
    try {
      const v = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (!v) return;
      q.value = v.q || ''; sort.value = v.sort || 'relevance'; status = v.s || '';
      selects.forEach((x, i) => (x.value = v.f?.[i] ?? ''));
      chips.forEach((c) => c.setAttribute('aria-pressed', String((c.dataset.status || '') === status)));
    } catch { /* ignore */ }
  };

  // Plain #name presets from links elsewhere: a status (#silent) or a world (#mars).
  const fromHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;
    if (chips.some((c) => c.dataset.status === h)) setStatus(h);
    const w = selects.find((s) => s.dataset.f === 'world');
    if (w && [...w.options].some((o) => o.value === h)) { w.value = h; apply(); }
  };
  window.addEventListener('hashchange', fromHash);
  if (!location.hash) restore();
  fromHash();
  apply();
}
