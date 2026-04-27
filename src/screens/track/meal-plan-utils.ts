import { MealType } from '@db/db-types';
import { MealPlanItem } from '@db/models/MealPlanItem';
import { en } from '@providers/language/languages/en';
import { MealTotals } from './meal-plan-types';

type Translations = typeof en;

export const mealTypeOrder: readonly MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function calculateMealTotals(items: MealPlanItem[]): MealTotals {
  const totals: MealTotals = { calories: 0, fat: 0, protein: 0, carbs: 0 };
  for (const item of items) {
    totals.calories += item.calories;
    totals.fat += item.fat;
    totals.protein += item.protein;
    totals.carbs += item.carbs;
  }
  return totals;
}

export function getMealTypeLabel(type: MealType, translations: Translations): string {
  switch (type) {
    case 'breakfast':
      return translations.track.mealBreakfast;
    case 'lunch':
      return translations.track.mealLunch;
    case 'dinner':
      return translations.track.mealDinner;
    case 'snack':
      return translations.track.mealSnack;
  }
}

export function formatMacros(totals: MealTotals, translations: Translations): string {
  const { fat, protein, carbs } = translations.track.macros;
  return `${fat} - ${roundMacro(totals.fat)} | ${protein} - ${roundMacro(totals.protein)} | ${carbs} - ${roundMacro(totals.carbs)}`;
}

function roundMacro(value: number): number {
  return Math.round(value * 10) / 10;
}
