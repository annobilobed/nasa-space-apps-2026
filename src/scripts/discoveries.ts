export function initDiscoveries() {
  // Before/after slider
  document.querySelectorAll<HTMLElement>('[data-compare]').forEach((c) => {
    const input = c.querySelector<HTMLInputElement>('[data-compare-input]')!;
    const set = () => c.style.setProperty('--pos', `${input.value}%`);
    input.addEventListener('input', set); set();
  });

  // Interior layers
  const interior = document.querySelector<HTMLElement>('[data-interior]');
  if (interior) {
    const btns = [...interior.querySelectorAll<HTMLButtonElement>('[data-layer-btn]')];
    const show = (k: string) => {
      interior.dataset.active = k;
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.layerBtn === k)));
      interior.querySelectorAll<HTMLElement>('[data-layer-info]').forEach((d) => (d.hidden = d.dataset.layerInfo !== k));
    };
    btns.forEach((b) => b.addEventListener('click', () => show(b.dataset.layerBtn!)));
    interior.querySelectorAll<SVGElement>('[data-layer]').forEach((l) => l.addEventListener('click', () => show(l.dataset.layer!)));
    show('crust');
  }

  // Laser ranging demo (slowed down; real round trip ≈ 2.56 s)
  const laser = document.querySelector<HTMLElement>('[data-laser]');
  if (laser) {
    const beam = laser.querySelector<HTMLElement>('[data-beam]')!;
    const out = laser.querySelector<HTMLElement>('[data-laser-out]')!;
    const btn = laser.querySelector<HTMLButtonElement>('[data-fire]')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const KM = 384_400, C = 299_792.458, RT = (2 * KM) / C;
    btn.addEventListener('click', () => {
      btn.disabled = true;
      out.textContent = 'Pulse sent… travelling to the Moon';
      const track = beam.parentElement!;
      const w = track.clientWidth - beam.clientWidth;
      const dur = reduce ? 1 : RT * 1000; // real-time round trip
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const x = p < 0.5 ? (p / 0.5) * w : (1 - (p - 0.5) / 0.5) * w;
        beam.style.opacity = reduce ? '0' : '1';
        beam.style.transform = `translateX(${x}px)`;
        if (p >= 0.5 && p < 1) out.textContent = 'Reflected by the Apollo mirrors… coming back';
        if (p < 1) requestAnimationFrame(step);
        else {
          beam.style.opacity = '0';
          out.textContent = `Returned after ${RT.toFixed(2)} s → distance ≈ ${(RT * C / 2).toLocaleString('en-GB', { maximumFractionDigits: 0 })} km`;
          btn.disabled = false;
        }
      };
      requestAnimationFrame(step);
    });
  }
}
