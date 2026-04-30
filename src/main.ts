import './style.css';

import heroHtml from './sections/hero.html?raw';
import manifestoHtml from './sections/manifesto.html?raw';
import duoHtml from './sections/duo.html?raw';
import mixesHtml from './sections/mixes.html?raw';
import gearHtml from './sections/gear.html?raw';
import genresHtml from './sections/genres.html?raw';
import formatsHtml from './sections/formats.html?raw';
import clientsHtml from './sections/clients.html?raw';
import galleryHtml from './sections/gallery.html?raw';
import bookingHtml from './sections/booking.html?raw';
import footerHtml from './sections/footer.html?raw';

import { initLenis } from './modules/lenis';
import { initCursor } from './modules/cursor';
import { initMagnetic } from './modules/magnetic';
import { initReveal, initScramble, initProgress } from './modules/reveal';
import { initLiveTime } from './modules/time';
import { initMarquees } from './modules/marquee';
import { initHeader } from './modules/header';
import { initHero } from './modules/hero';
import { initPlayer } from './modules/player';

import { formats } from './data/formats';
import { clients, genres } from './data/clients';
import { gallery } from './data/content';
import { tracks } from './data/tracks';

function mount() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = [
    heroHtml,
    manifestoHtml,
    duoHtml,
    mixesHtml,
    gearHtml,
    genresHtml,
    formatsHtml,
    clientsHtml,
    galleryHtml,
    bookingHtml,
    footerHtml,
  ].join('\n');
}

function renderFormats() {
  const root = document.querySelector<HTMLElement>('[data-formats]');
  if (!root) return;
  root.innerHTML = formats
    .map(
      (f) => `
      <article data-reveal="up" class="bg-bg p-6 md:p-10 flex flex-col ${
        f.featured ? 'md:scale-[1.02] md:z-10 outline outline-2 outline-accent outline-offset-[-2px]' : ''
      }">
        <div class="flex items-baseline justify-between mb-8">
          <span class="font-mono text-sm">${f.num} · ${f.title}</span>
          ${f.featured ? '<span class="mono text-accent">FEATURED</span>' : ''}
        </div>
        <h3 class="display text-3xl md:text-5xl mb-6">${f.subtitle}</h3>
        <p class="text-fg/85 leading-relaxed mb-8">${f.description}</p>
        <ul class="space-y-2 text-fg/85 mb-10">
          ${f.features.map((x) => `<li class="flex gap-2"><span class="text-accent">+</span><span>${x}</span></li>`).join('')}
        </ul>
        <div class="mt-auto pt-8 border-t border-line">
          <div class="display text-3xl md:text-4xl ${f.featured ? 'text-accent' : ''}">${f.price}</div>
          <div class="mono text-mute mt-2">${f.priceNote}</div>
        </div>
      </article>`,
    )
    .join('');
}

function renderClients() {
  const track = document.querySelector<HTMLElement>('[data-clients-track]');
  if (!track) return;
  // Render clients as a single track with large italic names
  track.innerHTML = clients
    .map(
      (c) => `
      <a href="${c.url}" target="_blank" rel="noopener" class="marquee-item display italic text-fg hover:text-accent transition-colors" style="font-size: clamp(48px, 9vw, 120px); padding-inline: 0.4em;" data-cursor="visit">
        ${c.name} <span class="text-mute" aria-hidden="true">·</span>
      </a>`,
    )
    .join('');
}

function renderGenres() {
  const track = document.querySelector<HTMLElement>('[data-genres-track]');
  if (!track) return;
  track.innerHTML = genres
    .map(
      (g) => `
      <span class="marquee-item">${g}<span class="text-mute mx-2">·</span></span>`,
    )
    .join('');
}

function renderGallery() {
  const root = document.querySelector<HTMLElement>('[data-gallery]');
  if (!root) return;
  root.innerHTML = gallery
    .map(
      (g) => `
      <figure data-reveal="clip" class="card-img ${g.span}">
        <img src="${g.src}" alt="${g.alt}" loading="lazy" />
      </figure>`,
    )
    .join('');
}

function setTrackCount() {
  const el = document.querySelector<HTMLElement>('[data-track-count]');
  if (el) el.textContent = `${tracks.length} TRACKS`;
}

function init() {
  mount();
  renderFormats();
  renderClients();
  renderGenres();
  renderGallery();
  setTrackCount();

  // Init order matters — DOM-touching modules first
  initLenis();
  initLiveTime();
  initHeader();
  initMarquees();
  initReveal();
  initScramble();
  initProgress();
  initHero();
  initPlayer();
  initCursor();
  initMagnetic();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
