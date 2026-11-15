export function initGallery() {
  const dlg = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  const btns = [...document.querySelectorAll<HTMLButtonElement>('[data-g-open]')];
  if (!dlg || !btns.length) return;
  const img = dlg.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const cap = dlg.querySelector<HTMLElement>('[data-lb-cap]')!;
  let cur = 0, opener: HTMLElement | null = null;
  const show = (i: number) => {
    cur = (i + btns.length) % btns.length;
    const thumb = btns[cur].querySelector('img')!;
    const set = thumb.getAttribute('srcset') || '';
    const largest = set.split(',').map((s) => s.trim().split(' ')[0]).pop() || thumb.src;
    img.src = largest; img.alt = thumb.alt;
    cap.innerHTML = btns[cur].parentElement?.querySelector('.placard')?.innerHTML || '';
  };
  btns.forEach((b, i) => b.addEventListener('click', () => { opener = b; show(i); dlg.showModal(); }));
  dlg.querySelector('[data-lb-prev]')?.addEventListener('click', () => show(cur - 1));
  dlg.querySelector('[data-lb-next]')?.addEventListener('click', () => show(cur + 1));
  dlg.querySelector('[data-lb-close]')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => opener?.focus());
}
