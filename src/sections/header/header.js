import './header.scss';

const SCROLL_OFFSET = 10;

export function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let ticking = false;

  const update = () => {
    header.classList.toggle('header--scrolled', window.scrollY > SCROLL_OFFSET);
    ticking = false;
  };

  // не чаще одного раза за кадр
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );

  // страница может открыться уже прокрученной (перезагрузка, переход по якорю)
  update();
}
