import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function splitWords(el: HTMLElement) {
  const text = el.textContent || '';
  el.textContent = '';
  const words: HTMLSpanElement[] = [];
  text.split(/(\s+)/).forEach((chunk) => {
    if (/^\s+$/.test(chunk)) {
      el.appendChild(document.createTextNode(chunk));
      return;
    }
    if (chunk.length === 0) return;
    const wrap = document.createElement('span');
    wrap.className = 'reveal-mask';
    const inner = document.createElement('span');
    inner.className = 'word';
    inner.textContent = chunk;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    words.push(inner);
  });
  return words;
}

function splitChars(el: HTMLElement) {
  const text = el.textContent || '';
  el.textContent = '';
  const chars: HTMLSpanElement[] = [];
  for (const ch of text) {
    if (ch === ' ') {
      el.appendChild(document.createTextNode(' '));
      continue;
    }
    const wrap = document.createElement('span');
    wrap.className = 'reveal-mask';
    const inner = document.createElement('span');
    inner.className = 'char';
    inner.textContent = ch;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    chars.push(inner);
  }
  return chars;
}

export function initReveal() {
  if (reduceMotion()) return;

  // Headlines: char-level
  document.querySelectorAll<HTMLElement>('[data-reveal="chars"]').forEach((el) => {
    const chars = splitChars(el);
    gsap.set(chars, { yPercent: 110, opacity: 1 });
    gsap.to(chars, {
      yPercent: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.018,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });

  // Paragraphs / titles: word-level fade-up
  document.querySelectorAll<HTMLElement>('[data-reveal="words"]').forEach((el) => {
    const words = splitWords(el);
    gsap.set(words, { yPercent: 60, opacity: 0, filter: 'blur(8px)' });
    gsap.to(words, {
      yPercent: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.025,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });

  // Generic fade-up
  document.querySelectorAll<HTMLElement>('[data-reveal="up"]').forEach((el) => {
    gsap.set(el, { y: 30, opacity: 0 });
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Image clip reveal
  document.querySelectorAll<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
    gsap.set(el, { clipPath: 'inset(100% 0 0 0)' });
    gsap.to(el, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });

  // Side reveals (cards)
  document.querySelectorAll<HTMLElement>('[data-reveal="left"]').forEach((el) => {
    gsap.set(el, { x: -60, opacity: 0 });
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
  document.querySelectorAll<HTMLElement>('[data-reveal="right"]').forEach((el) => {
    gsap.set(el, { x: 60, opacity: 0 });
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

// Scramble text on hover
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export function initScramble() {
  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
    const original = el.textContent || '';
    let frame = 0;
    let raf = 0;
    let active = false;

    const scramble = () => {
      const progress = Math.min(frame / 20, 1);
      let out = '';
      for (let i = 0; i < original.length; i++) {
        if (i / original.length < progress) {
          out += original[i];
        } else if (original[i] === ' ') {
          out += ' ';
        } else {
          out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      el.textContent = out;
      frame++;
      if (progress < 1 && active) {
        raf = requestAnimationFrame(scramble);
      } else {
        el.textContent = original;
      }
    };

    el.addEventListener('mouseenter', () => {
      active = true;
      frame = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scramble);
    });
    el.addEventListener('mouseleave', () => {
      active = false;
      cancelAnimationFrame(raf);
      el.textContent = original;
    });
  });
}

// Scramble-in animation (used in hero meta)
export function scrambleIn(el: HTMLElement, duration = 1.2) {
  const original = el.textContent || '';
  const start = performance.now();
  const totalFrames = 60;

  const tick = (now: number) => {
    const t = Math.min((now - start) / (duration * 1000), 1);
    const revealed = Math.floor(t * original.length);
    let out = '';
    for (let i = 0; i < original.length; i++) {
      if (i < revealed) {
        out += original[i];
      } else if (original[i] === ' ') {
        out += ' ';
      } else {
        out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    el.textContent = out;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = original;
  };
  requestAnimationFrame(tick);
  void totalFrames;
}

// Page progress bar
export function initProgress() {
  const fill = document.querySelector<HTMLElement>('[data-progress]');
  if (!fill) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? window.scrollY / h : 0;
    fill.style.transform = `scaleX(${p})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}
