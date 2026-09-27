import './burger-menu.scss';

import { t } from '@/i18n';
import { NAV_TOGGLE, NAV_CHANGE } from '@/components/nav-menu/nav-menu';

export function initBurgerMenu() {
  const button = document.querySelector('.burger-menu');
  if (!button) return;

  const label = button.querySelector('[data-i18n]');

  button.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent(NAV_TOGGLE));
  });

  document.addEventListener(NAV_CHANGE, ({ detail: { open } }) => {
    button.setAttribute('aria-expanded', String(open));

    // меняем ключ, а не только текст — чтобы при смене языка подпись осталась верной
    const key = open ? 'header.close' : 'header.menu';
    label.dataset.i18n = key;
    label.textContent = t(key);

    // при закрытии с клавиатуры (Esc) фокус остаётся на кнопке
    if (!open && document.activeElement?.closest('.nav-menu')) button.focus();
  });
}
