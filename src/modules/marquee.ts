// Duplicates marquee tracks so the loop is seamless.
export function initMarquees() {
  document.querySelectorAll<HTMLElement>('.marquee').forEach((m) => {
    const track = m.querySelector<HTMLElement>('.marquee-track');
    if (!track) return;
    const clone = track.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    m.appendChild(clone);
  });
}
