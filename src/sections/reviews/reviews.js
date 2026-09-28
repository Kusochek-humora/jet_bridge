import 'swiper/css';
import './reviews.scss';

import Swiper from 'swiper';
import { Navigation, Keyboard } from 'swiper/modules';

export function initReviews() {
  const slider = document.querySelector('.reviews__slider');
  if (!slider) return;

  new Swiper(slider.querySelector('.reviews__swiper'), {
    modules: [Navigation, Keyboard],
    slidesPerView: 'auto', // ширина слайда — в css (305px, как в макете)
    spaceBetween: 20,
    watchOverflow: true, // если все отзывы влезли — стрелки отключаются
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: {
      prevEl: slider.querySelector('.reviews__nav--prev'),
      nextEl: slider.querySelector('.reviews__nav--next'),
      disabledClass: 'is-disabled',
    },
    breakpoints: {
      0: { spaceBetween: 12 },
      577: { spaceBetween: 20 },
    },
  });
}
