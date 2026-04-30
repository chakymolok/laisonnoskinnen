import WaveSurfer from 'wavesurfer.js';
import { tracks, type Track } from '../data/tracks';

function fmtTime(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const playIcon = `
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/>
  </svg>
`;
const pauseIcon = `
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>
`;

export class Player {
  private ws: WaveSurfer | null = null;
  private currentIndex = 0;
  private playing = false;

  // DOM refs
  private root: HTMLElement;
  private waveEl: HTMLElement;
  private titleEl: HTMLElement;
  private artistEl: HTMLElement;
  private tagsEl: HTMLElement;
  private numEl: HTMLElement;
  private currentTimeEl: HTMLElement;
  private durationEl: HTMLElement;
  private playBtn: HTMLButtonElement;
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private listEl: HTMLElement;
  private formatEl: HTMLElement;
  private externalEl: HTMLAnchorElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.waveEl = root.querySelector<HTMLElement>('#waveform')!;
    this.titleEl = root.querySelector<HTMLElement>('[data-player-title]')!;
    this.artistEl = root.querySelector<HTMLElement>('[data-player-artist]')!;
    this.tagsEl = root.querySelector<HTMLElement>('[data-player-tags]')!;
    this.numEl = root.querySelector<HTMLElement>('[data-player-num]')!;
    this.currentTimeEl = root.querySelector<HTMLElement>('[data-player-current]')!;
    this.durationEl = root.querySelector<HTMLElement>('[data-player-duration]')!;
    this.playBtn = root.querySelector<HTMLButtonElement>('[data-player-play]')!;
    this.prevBtn = root.querySelector<HTMLButtonElement>('[data-player-prev]')!;
    this.nextBtn = root.querySelector<HTMLButtonElement>('[data-player-next]')!;
    this.listEl = root.querySelector<HTMLElement>('[data-player-list]')!;
    this.formatEl = root.querySelector<HTMLElement>('[data-player-format]')!;
    this.externalEl = root.querySelector<HTMLAnchorElement>('[data-player-external]')!;

    this.renderList();
    this.bindControls();
    this.loadTrack(0, false);
    this.setPlayIcon(false);
  }

  private renderList() {
    this.listEl.innerHTML = tracks
      .map(
        (t, i) => `
        <div class="track-row" data-track-index="${i}" role="button" tabindex="0" aria-label="Play ${t.title}">
          <div class="track-num font-mono text-xs text-mute">${t.num}</div>
          <div class="min-w-0">
            <div class="text-sm md:text-base truncate" data-row-title>${t.title}</div>
            <div class="track-meta mono mt-1 truncate">${t.artist} · ${t.tags}</div>
          </div>
          <div class="flex items-center gap-3">
            <span class="eq" data-eq style="display:none"><span></span><span></span><span></span></span>
            <span class="font-mono text-xs text-mute">${t.duration}</span>
          </div>
        </div>`,
      )
      .join('');

    this.listEl.querySelectorAll<HTMLElement>('.track-row').forEach((row) => {
      const idx = Number(row.dataset.trackIndex);
      const activate = () => this.loadTrack(idx, true);
      row.addEventListener('click', activate);
      row.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });
  }

  private bindControls() {
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    document.addEventListener('keydown', (e) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (!this.isPlayerInView()) return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowRight') {
        this.next();
      } else if (e.code === 'ArrowLeft') {
        this.prev();
      }
    });
  }

  private isPlayerInView() {
    const rect = this.root.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  private setPlayIcon(playing: boolean) {
    this.playBtn.innerHTML = playing ? pauseIcon : playIcon;
    this.playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }

  private updateActiveRow() {
    this.listEl.querySelectorAll<HTMLElement>('.track-row').forEach((row, i) => {
      const eq = row.querySelector<HTMLElement>('[data-eq]');
      if (i === this.currentIndex) {
        row.classList.add('is-active');
        if (eq) eq.style.display = this.playing ? 'inline-flex' : 'none';
      } else {
        row.classList.remove('is-active');
        if (eq) eq.style.display = 'none';
      }
    });
  }

  private loadTrack(index: number, autoplay: boolean) {
    if (index < 0 || index >= tracks.length) return;
    this.currentIndex = index;
    const t = tracks[index];
    this.renderMeta(t);
    this.updateActiveRow();

    // Tear down previous wavesurfer
    if (this.ws) {
      try {
        this.ws.destroy();
      } catch {
        /* ignore */
      }
      this.ws = null;
    }

    if (!t.audioUrl) {
      // No audio yet — show "soon" state
      this.waveEl.innerHTML = `
        <div class="flex h-20 items-center justify-center mono text-mute">
          скоро · следите за обновлениями${t.externalUrl ? ' · ' : ''}${
        t.externalUrl ? `<a class="ml-2 link text-fg" href="${t.externalUrl}" target="_blank" rel="noopener">external →</a>` : ''
      }
        </div>`;
      this.playing = false;
      this.setPlayIcon(false);
      this.currentTimeEl.textContent = '00:00';
      this.durationEl.textContent = t.duration;
      return;
    }

    this.waveEl.innerHTML = '';
    this.ws = WaveSurfer.create({
      container: this.waveEl,
      waveColor: '#2a2a2a',
      progressColor: '#ff3d00',
      cursorColor: 'transparent',
      height: 80,
      barWidth: 2,
      barGap: 2,
      barRadius: 1,
      normalize: true,
      hideScrollbar: true,
      interact: true,
    });

    this.ws.on('ready', () => {
      const dur = this.ws?.getDuration() || 0;
      this.durationEl.textContent = fmtTime(dur);
      if (autoplay) this.ws?.play();
    });
    this.ws.on('play', () => {
      this.playing = true;
      this.setPlayIcon(true);
      this.updateActiveRow();
    });
    this.ws.on('pause', () => {
      this.playing = false;
      this.setPlayIcon(false);
      this.updateActiveRow();
    });
    this.ws.on('timeupdate', (cur: number) => {
      this.currentTimeEl.textContent = fmtTime(cur);
    });
    this.ws.on('finish', () => this.next());
    this.ws.on('error', () => {
      this.waveEl.innerHTML = `
        <div class="flex h-20 items-center justify-center mono text-mute">
          не удалось загрузить аудио · ${t.externalUrl ? `<a class="ml-2 link text-fg" href="${t.externalUrl}" target="_blank" rel="noopener">external →</a>` : 'попробуйте позже'}
        </div>`;
      this.setPlayIcon(false);
    });

    this.ws.load(t.audioUrl);
    this.currentTimeEl.textContent = '00:00';
    this.durationEl.textContent = t.duration;
  }

  private renderMeta(t: Track) {
    this.titleEl.textContent = t.title;
    this.artistEl.textContent = t.artist;
    this.tagsEl.textContent = t.tags;
    this.numEl.textContent = t.num;
    this.formatEl.textContent = t.format.toUpperCase();
    if (t.externalUrl) {
      this.externalEl.href = t.externalUrl;
      this.externalEl.style.display = '';
    } else {
      this.externalEl.removeAttribute('href');
      this.externalEl.style.display = 'none';
    }
  }

  togglePlay() {
    if (!this.ws) return;
    if (this.playing) this.ws.pause();
    else this.ws.play();
  }
  next() {
    const ni = (this.currentIndex + 1) % tracks.length;
    this.loadTrack(ni, true);
  }
  prev() {
    const ni = (this.currentIndex - 1 + tracks.length) % tracks.length;
    this.loadTrack(ni, true);
  }
}

export function initPlayer() {
  const root = document.querySelector<HTMLElement>('[data-player]');
  if (!root) return;
  new Player(root);
}
