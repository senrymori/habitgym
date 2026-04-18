import { LocaleConfig } from 'react-native-calendars';
import { Locale } from '@providers/language/localized-strings';

const ruLocaleConfig = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня',
};

let areLocalesRegistered = false;

export function registerCalendarLocales(): void {
  if (areLocalesRegistered) return;
  LocaleConfig.locales['ru'] = ruLocaleConfig;
  LocaleConfig.locales['en'] = LocaleConfig.locales[''];
  areLocalesRegistered = true;
}

export function setCalendarLocale(language: Locale): void {
  LocaleConfig.defaultLocale = language === Locale.ru ? 'ru' : 'en';
}

registerCalendarLocales();
