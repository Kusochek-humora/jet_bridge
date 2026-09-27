import './lang-switcher.scss';

import { i18next, setLanguage } from '@/i18n';

export function initLangSwitcher() {
  const buttons = document.querySelectorAll('[data-lang]');
  if (!buttons.length) return;

  const updateActive = () => {
    buttons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.lang === i18next.language);
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  i18next.on('languageChanged', updateActive);
  updateActive();
}
