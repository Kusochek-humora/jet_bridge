import 'normalize.css';
import './styles/main.scss';

import { initI18n } from './i18n';
import { initLangSwitcher } from './components/lang-switcher/lang-switcher';
import { initBurgerMenu } from './components/burger-menu/burger-menu';

import { initHeader } from './sections/header/header';
import './sections/hero/hero';
import './sections/about/about';
import './sections/advantages/advantages';
import './sections/tariffs/tariffs';
import './sections/how-it-works/how-it-works';
import './sections/categories/categories';
import './sections/reviews/reviews';
import './sections/request-form/request-form';
import './sections/contacts/contacts';
import './sections/footer/footer';

await initI18n();

initLangSwitcher();
initBurgerMenu();
initHeader();
