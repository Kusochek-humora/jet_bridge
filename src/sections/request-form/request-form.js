import './request-form.scss';

import { t } from '@/i18n';
import { openSuccessModal } from '@/components/success-modal/success-modal';

const SEND_DELAY = 800; // имитация запроса к серверу

// Телефон: +7 (XXX) XXX-XX-XX — маска форматирует ввод, в номере ровно 11 цифр
const formatPhone = (value) => {
  let digits = value.replace(/\D/g, '');
  // вставили номер без кода страны (10 цифр, для KZ мобильные начинаются на 7)
  if (!value.includes('+') && digits.length === 10) digits = `7${digits}`;
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith('7')) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const parts = [digits.slice(1, 4), digits.slice(4, 7), digits.slice(7, 9), digits.slice(9, 11)];
  let result = '+7';
  if (parts[0]) result += ` (${parts[0]}`;
  // скобку закрываем, только когда пошли следующие цифры — иначе Backspace на ней застревает
  if (parts[1]) result += `) ${parts[1]}`;
  if (parts[2]) result += `-${parts[2]}`;
  if (parts[3]) result += `-${parts[3]}`;
  return result;
};

// Проверка значения: null — всё хорошо, иначе ключ ошибки (requestForm.errors.<ключ>)
const rules = {
  name: (v) => {
    const value = v.trim();
    if (/[^\p{L}\s'-]/u.test(value)) return 'nameChars'; // буквы любого алфавита, пробел, дефис, апостроф
    if (value.replace(/[\s'-]/g, '').length < 2) return 'name';
    return null;
  },
  phone: (v) => (v.replace(/\D/g, '').length === 11 ? null : 'phone'),
  weight: (v) => (Number(v.replace(',', '.')) > 0 ? null : 'weight'),
};

export function initRequestForm() {
  const form = document.querySelector('.request-form__form');
  if (!form) return;

  const fields = [...form.querySelectorAll('.request-form__input')];
  const button = form.querySelector('.request-form__btn');
  const buttonLabel = button.querySelector('[data-i18n]');

  // ключ ошибки кладём в data-i18n — при смене языка текст переведётся сам
  const showError = (input, errorKey) => {
    const error = form.querySelector(`#${input.id}-error`);
    const hasError = Boolean(errorKey);

    input.setAttribute('aria-invalid', String(hasError));
    input.classList.toggle('is-invalid', hasError);

    if (hasError) {
      const key = `requestForm.errors.${errorKey}`;
      error.dataset.i18n = key;
      error.textContent = t(key);
    } else {
      delete error.dataset.i18n;
      error.textContent = '';
    }
  };

  const validate = (input) => {
    const errorKey = rules[input.name](input.value);
    showError(input, errorKey);
    return !errorKey;
  };

  // ---------- телефон ----------
  const phone = form.elements.phone;
  phone.addEventListener('focus', () => {
    if (!phone.value) phone.value = '+7';
  });
  phone.addEventListener('input', () => {
    // ввели буквы или символы — маска их уберёт, но сразу скажем почему
    const typedWrong = /[^\d\s()+-]/.test(phone.value);
    phone.value = formatPhone(phone.value);
    if (typedWrong) showError(phone, 'phoneChars');
    else if (phone.classList.contains('is-invalid')) validate(phone);
  });
  phone.addEventListener('blur', () => {
    if (phone.value === '+7') phone.value = '';
  });

  // ---------- вес ----------
  const weight = form.elements.weight;
  weight.addEventListener('input', () => {
    const cleaned = weight.value.replace(/[^\d.,]/g, '');
    const typedWrong = cleaned !== weight.value;
    weight.value = cleaned;
    if (typedWrong) showError(weight, 'weightChars');
    else if (weight.classList.contains('is-invalid')) validate(weight);
  });

  // ---------- имя ----------
  // цифры и символы не вырезаем, а сразу предупреждаем — пользователь видит, что не так
  const name = form.elements.name;
  name.addEventListener('input', () => {
    if (rules.name(name.value) === 'nameChars' || name.classList.contains('is-invalid')) validate(name);
  });

  // после ухода с заполненного поля — полная проверка
  fields.forEach((input) => {
    input.addEventListener('blur', () => {
      if (input.value) validate(input);
    });
  });

  // ---------- отправка (имитация) ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = fields.map(validate);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus();
      return;
    }

    // TODO: реальная отправка (fetch) — бэкенда в тестовом задании нет
    button.disabled = true;
    buttonLabel.dataset.i18n = 'requestForm.sending';
    buttonLabel.textContent = t('requestForm.sending');

    setTimeout(() => {
      form.reset();
      fields.forEach((input) => showError(input, null));

      button.disabled = false;
      buttonLabel.dataset.i18n = 'requestForm.btn';
      buttonLabel.textContent = t('requestForm.btn');

      openSuccessModal();
    }, SEND_DELAY);
  });
}
