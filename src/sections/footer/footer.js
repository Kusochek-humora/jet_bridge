import './footer.scss';

// Год в копирайте — по UTC, чтобы у всех посетителей он был одинаковым в момент смены года
export function initFooter() {
  const year = document.querySelector('.footer__year');
  if (!year) return;

  const current = String(new Date().getUTCFullYear());
  year.textContent = current;
  year.setAttribute('datetime', current);
}
