export function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 100) header.classList.add('is-visible');
    else header.classList.remove('is-visible');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
