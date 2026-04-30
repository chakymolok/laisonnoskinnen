import { gsap } from 'gsap';

export function initCursor() {
  const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isCoarse) return;

  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  const label = document.querySelector<HTMLElement>('[data-cursor-label]');
  if (!dot || !ring || !label) return;

  document.body.classList.add('has-custom-cursor');

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(dot, { duration: 0.12, x: mx, y: my, ease: 'power2.out' });
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    gsap.set(ring, { x: rx, y: ry });
  });

  // Hover targets
  const setHover = (text: string | null, active = false) => {
    if (text) {
      label.textContent = text;
      ring.classList.add('is-hover');
    } else {
      ring.classList.remove('is-hover');
      label.textContent = '';
    }
    if (active) ring.classList.add('is-active');
    else ring.classList.remove('is-active');
  };

  document.addEventListener('mouseover', (e) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    const cursorEl = t.closest<HTMLElement>('[data-cursor]');
    if (cursorEl) {
      setHover(cursorEl.dataset.cursor || '');
      return;
    }
    if (t.closest('a, button, .btn, .track-row, .player-play, [role="button"]')) {
      setHover('→');
      return;
    }
  });

  document.addEventListener('mouseout', (e) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    if (t.closest('[data-cursor], a, button, .btn, .track-row, .player-play, [role="button"]')) {
      setHover(null);
    }
  });

  document.addEventListener('mousedown', () => ring.classList.add('is-active'));
  document.addEventListener('mouseup', () => ring.classList.remove('is-active'));
}
