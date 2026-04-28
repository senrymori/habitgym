import { Locale } from '@providers/language/localized-strings';

interface PluralForms {
  one: string;
  few: string;
  many: string;
}

export function pluralize(count: number, forms: PluralForms, locale: Locale): string {
  const template = locale === Locale.ru ? pickRussianForm(count, forms) : pickEnglishForm(count, forms);
  return template.replace('{count}', String(count));
}

function pickRussianForm(count: number, forms: PluralForms): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms.one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms.few;
  return forms.many;
}

function pickEnglishForm(count: number, forms: PluralForms): string {
  return count === 1 ? forms.one : forms.many;
}
