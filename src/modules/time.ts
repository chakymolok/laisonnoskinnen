function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function getMskTimeString() {
  const now = new Date();
  // Build MSK time using UTC + 3
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const msk = new Date(utc + 3 * 60 * 60 * 1000);
  return `${pad(msk.getHours())}:${pad(msk.getMinutes())}:${pad(msk.getSeconds())}`;
}

export function initLiveTime() {
  const targets = document.querySelectorAll<HTMLElement>('[data-msk-clock]');
  if (!targets.length) return;
  const tick = () => {
    const t = getMskTimeString();
    targets.forEach((el) => {
      el.textContent = t;
    });
  };
  tick();
  setInterval(tick, 1000);
}
