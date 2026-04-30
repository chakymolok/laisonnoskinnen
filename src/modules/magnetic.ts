import { gsap } from 'gsap';

export function initMagnetic() {
  const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isCoarse) return;

  const targets = document.querySelectorAll<HTMLElement>('[data-magnetic]');
  targets.forEach((el) => {
    const strength = Number(el.dataset.magnetStrength || 0.35);
    const radius = Number(el.dataset.magnetRadius || 90);

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius * 1.3) {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
        return;
      }
      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
    };

    const parent = el.parentElement || el;
    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);
  });
}
