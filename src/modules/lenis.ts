import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function initLenis() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return null;

  lenis = new Lenis({
    duration: 1.1,
    lerp: 0.09,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Anchor links
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!target) return;
    const href = target.getAttribute('href');
    if (!href || href === '#') return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    lenis?.scrollTo(el as HTMLElement, { offset: -40 });
  });

  return lenis;
}

export function getLenis() {
  return lenis;
}
