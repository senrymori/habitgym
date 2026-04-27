import { MealPlan } from '@db/models/MealPlan';
import { MealPlanMeal } from '@db/models/MealPlanMeal';
import { MealPlanItem } from '@db/models/MealPlanItem';

export interface MealTotals {
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
}

export interface MealPlanSummary {
  plan: MealPlan;
  totals: MealTotals;
}

export interface MealSection {
  meal: MealPlanMeal;
  items: MealPlanItem[];
  totals: MealTotals;
}

export interface MealItemFormValues {
  productName: string;
  grams: string;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
}
