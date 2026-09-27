import './nav-menu.scss';

// События между кнопкой-бургером и меню (компоненты друг друга не импортируют):
//   'nav-menu:toggle'  — кнопка просит открыть/закрыть меню
//   'nav-menu:change'  — меню сообщает новое состояние, detail: { open: boolean }
export const NAV_TOGGLE = 'nav-menu:toggle';
export const NAV_CHANGE = 'nav-menu:change';

const OPEN_CLASS = 'is-open';
const ROOT_OPEN_CLASS = 'is-menu-open'; // на <html>: блокировка скролла на мобильных
const ACTIVE_CLASS = 'active';

export function initNavMenu() {
  const nav = document.querySelector('.nav-menu');
  if (!nav) return;

  let isOpen = false;

  const setOpen = (open) => {
    if (open === isOpen) return;
    isOpen = open;

    nav.classList.toggle(OPEN_CLASS, open);
    document.documentElement.classList.toggle(ROOT_OPEN_CLASS, open);
    document.dispatchEvent(new CustomEvent(NAV_CHANGE, { detail: { open } }));
  };

  document.addEventListener(NAV_TOGGLE, () => setOpen(!isOpen));

  // переход по пункту — закрываем, страница прокрутится к секции
  nav.addEventListener('click', (e) => {
    if (e.target.closest('.nav-menu__link')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) setOpen(false);
  });

  initScrollSpy(nav);
}

// Подсветка пункта той секции, что сейчас на экране.
// Линия-детектор — горизонталь посередине экрана: активна секция, которая её пересекает.
function initScrollSpy(nav) {
  const links = [...nav.querySelectorAll('.nav-menu__link[href^="#"]')];

  // уникальные секции из ссылок (на одну секцию может вести несколько пунктов), в порядке на странице
  const ids = [...new Set(links.map((link) => link.hash.slice(1)))];
  const sections = ids
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.hash === `#${id}`;
      link.classList.toggle(ACTIVE_CLASS, active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
        // ушли выше первой секции (в hero) — ничего не подсвечиваем
        else if (entry.target === sections[0] && entry.boundingClientRect.top > 0) setActive(null);
      });
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}
