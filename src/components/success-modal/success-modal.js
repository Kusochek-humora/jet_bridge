import './success-modal.scss';

const CLOSE_DURATION = 250; // = transition в success-modal.scss

let dialog;

function close() {
  if (!dialog?.open) return;
  // сначала анимация скрытия, потом настоящее закрытие
  dialog.classList.add('is-closing');
  setTimeout(() => {
    dialog.classList.remove('is-closing');
    dialog.close();
  }, CLOSE_DURATION);
}

function init() {
  dialog = document.querySelector('.success-modal');
  if (!dialog) return;

  dialog.querySelector('.success-modal__close').addEventListener('click', close);
  dialog.querySelector('.success-modal__btn').addEventListener('click', close);

  // клик по затемнению (мимо окна) — закрыть
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });

  // Esc: браузер закрывает сам, перехватываем — чтобы сыграла анимация
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('is-modal-open');
  });
}

export function openSuccessModal() {
  if (!dialog) init();
  if (!dialog || dialog.open) return;

  document.documentElement.classList.add('is-modal-open');
  dialog.showModal();
}
