import { gsap } from 'gsap';
import { scrambleIn } from './reveal';

export function initHero() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // Hero title: each .hero-line .hero-char animates in
  const chars = document.querySelectorAll<HTMLElement>('[data-hero-char]');
  if (chars.length) {
    gsap.set(chars, { yPercent: 110, opacity: 1 });
    gsap.to(chars, {
      yPercent: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.04,
      delay: 0.15,
    });
  }

  // Sub-line fade up
  const sub = document.querySelectorAll<HTMLElement>('[data-hero-sub]');
  gsap.set(sub, { y: 30, opacity: 0 });
  gsap.to(sub, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.1,
    delay: 0.9,
  });

  // CTA fade up
  const cta = document.querySelectorAll<HTMLElement>('[data-hero-cta]');
  gsap.set(cta, { y: 20, opacity: 0 });
  gsap.to(cta, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    delay: 1.3,
  });

  // Scramble meta
  const metaEls = document.querySelectorAll<HTMLElement>('[data-hero-scramble]');
  metaEls.forEach((el, i) => {
    setTimeout(() => scrambleIn(el, 0.9), 200 + i * 120);
  });
}
