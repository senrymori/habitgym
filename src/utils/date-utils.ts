import {
  addDays,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  getISODay,
  isSameDay as isSameDayFns,
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
} from 'date-fns';
import { ru as ruLocale } from 'date-fns/locale';
import { Locale, Translations } from '@providers/language/localized-strings';

export interface Streak {
  years: number;
  months: number;
  days: number;
}

export interface PluralForms {
  one: string;
  few: string;
  many: string;
}

export type WeekdayIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function formatHeaderDate(date: Date, locale: Locale = Locale.en): string {
  if (locale === Locale.ru) {
    return format(date, 'EE, d MMMM', { locale: ruLocale });
  }
  return format(date, 'EE, d MMMM');
}

export function formatShortDate(date: Date): string {
  return format(date, 'dd.MM.yyyy');
}

export function calculateStreak(startDate: Date, today: Date): Streak {
  const years = differenceInYears(today, startDate);
  const afterYears = subYears(startDate, -years);
  const months = differenceInMonths(today, afterYears);
  const afterMonths = subMonths(afterYears, -months);
  const days = differenceInDays(today, afterMonths);
  return { years, months, days };
}

export function pluralize(count: number, forms: PluralForms, locale: Locale): string {
  const template = pickPluralForm(count, forms, locale);
  return template.replace('{count}', String(count));
}

export function formatStreak(streak: Streak, t: Translations, locale: Locale): string {
  const parts: string[] = [];
  if (streak.years > 0) parts.push(pluralize(streak.years, t.habits.streakYears, locale));
  if (streak.months > 0) parts.push(pluralize(streak.months, t.habits.streakMonths, locale));
  if (streak.days > 0 || parts.length === 0) {
    parts.push(pluralize(streak.days, t.habits.streakDays, locale));
  }
  return parts.join(' ');
}

export function getWeekdayIndex(date: Date): WeekdayIndex {
  return getISODay(date) as WeekdayIndex;
}

export function isSameDay(a: Date, b: Date): boolean {
  return isSameDayFns(a, b);
}

export function getMonthMatrix(year: number, month: number): Date[][] {
  const firstDay = startOfMonth(new Date(year, month, 1));
  const gridStart = startOfWeek(firstDay, { weekStartsOn: 1 });
  const matrix: Date[][] = [];
  for (let week = 0; week < 6; week++) {
    const row: Date[] = [];
    for (let day = 0; day < 7; day++) {
      row.push(addDays(gridStart, week * 7 + day));
    }
    matrix.push(row);
  }
  return matrix;
}

function pickPluralForm(count: number, forms: PluralForms, locale: Locale): string {
  if (locale === Locale.ru) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return forms.one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms.few;
    return forms.many;
  }
  return count === 1 ? forms.one : forms.many;
}
