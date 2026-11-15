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
  // Swipe left or right on a phone to move between photos (the arrow keys do this on a laptop).
  let sx = 0, sy = 0, swiping = false;
  img.style.touchAction = 'pan-y pinch-zoom';
  img.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; sx = e.clientX; sy = e.clientY; swiping = true; });
  img.addEventListener('pointerup', (e) => {
    if (!swiping) return; swiping = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx < 0 ? 1 : -1));
  });
  img.addEventListener('pointercancel', () => (swiping = false));
  dlg.addEventListener('close', () => opener?.focus());
}
