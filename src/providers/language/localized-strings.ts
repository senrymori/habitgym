import { en } from './languages/en';

export const languages = {
  en,
  // ru,
};

export const Locale = {
  en: 'en',
  // ru: 'ru',
} as const;
export type Locale = (typeof Locale)[keyof typeof Locale];

export type Translations = typeof en;

let currentLanguage: Locale = Locale.en;

const target = {
  setLanguage(language: Locale) {
    currentLanguage = language;
  },
};

export const localizedStrings = new Proxy(target, {
  get(obj, prop) {
    if (prop in obj) return obj[prop as keyof typeof obj];
    const strings = languages[currentLanguage as keyof typeof languages] ?? languages.en;
    return strings[prop as keyof Translations];
  },
}) as typeof target & Translations;
