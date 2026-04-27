import { useCallback, useEffect, useMemo, useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@providers/DatabaseProvider';
import { MealPlan } from '@db/models/MealPlan';
import { MealPlanMeal } from '@db/models/MealPlanMeal';
import { MealPlanItem } from '@db/models/MealPlanItem';
import { MealItemFormValues, MealSection } from './meal-plan-types';
import { calculateMealTotals, mealTypeOrder } from './meal-plan-utils';

interface UseMealPlanDayResult {
  plan: MealPlan | null;
  sections: MealSection[];
}

export function useMealPlanDay(planId: string): UseMealPlanDayResult {
  const database = useDatabase();
  // Wrap in object so React always sees a new reference on update.
  // WatermelonDB's findAndObserve emits the same model instance mutated in-place.
  const [planWrapper, setPlanWrapper] = useState<{ value: MealPlan } | null>(null);
  const [meals, setMeals] = useState<MealPlanMeal[]>([]);
  const [items, setItems] = useState<MealPlanItem[]>([]);

  const plan = planWrapper?.value ?? null;

  useEffect(() => {
    const sub = database.get<MealPlan>('meal_plans').findAndObserve(planId).subscribe((p) => {
      setPlanWrapper({ value: p });
    });
    return () => sub.unsubscribe();
  }, [database, planId]);

  useEffect(() => {
    const sub = database
      .get<MealPlanMeal>('meal_plan_meals')
      .query(Q.where('plan_id', planId), Q.sortBy('sort_order', Q.asc))
      .observe()
      .subscribe(setMeals);
    return () => sub.unsubscribe();
  }, [database, planId]);

  useEffect(() => {
    const sub = database.get<MealPlanItem>('meal_plan_items').query().observe().subscribe(setItems);
    return () => sub.unsubscribe();
  }, [database]);

  // Safety net: create missing meal sections if some are absent.
  useEffect(() => {
    if (meals.length >= mealTypeOrder.length) return;
    const present = new Set(meals.map((m) => m.mealType));
    const missing = mealTypeOrder.filter((type) => !present.has(type));
    if (missing.length === 0) return;
    let cancelled = false;
    void database.write(async () => {
      if (cancelled) return;
      const collection = database.get<MealPlanMeal>('meal_plan_meals');
      await Promise.all(
        missing.map((type) =>
          collection.create((record) => {
            record.planId = planId;
            record.mealType = type;
            record.sortOrder = mealTypeOrder.indexOf(type);
          })
        )
      );
    });
    return () => {
      cancelled = true;
    };
  }, [database, planId, meals]);

  const sections = useMemo<MealSection[]>(() => {
    const itemsByMeal = new Map<string, MealPlanItem[]>();
    for (const item of items) {
      const list = itemsByMeal.get(item.mealId);
      if (list) list.push(item);
      else itemsByMeal.set(item.mealId, [item]);
    }
    const ordered = [...meals].sort(
      (a, b) => mealTypeOrder.indexOf(a.mealType) - mealTypeOrder.indexOf(b.mealType)
    );
    return ordered.map((meal) => {
      const sectionItems = itemsByMeal.get(meal.id) ?? [];
      return {
        meal,
        items: sectionItems,
        totals: calculateMealTotals(sectionItems),
      };
    });
  }, [meals, items]);

  return { plan, sections };
}

interface UseMealPlanDayActionsResult {
  addMealItem: (mealId: string, values: MealItemFormValues) => Promise<void>;
  updateMealItem: (itemId: string, values: MealItemFormValues) => Promise<void>;
  deleteMealItem: (itemId: string) => Promise<void>;
  renamePlan: (planId: string, name: string) => Promise<void>;
}

export function useMealPlanDayActions(): UseMealPlanDayActionsResult {
  const database = useDatabase();

  const addMealItem = useCallback(
    async (mealId: string, values: MealItemFormValues) => {
      const parsed = parseFormValues(values);
      await database.write(async () => {
        await database.get<MealPlanItem>('meal_plan_items').create((record) => {
          record.mealId = mealId;
          record.productName = parsed.productName;
          record.grams = parsed.grams;
          record.calories = parsed.calories;
          record.protein = parsed.protein;
          record.fat = parsed.fat;
          record.carbs = parsed.carbs;
        });
      });
    },
    [database]
  );

  const updateMealItem = useCallback(
    async (itemId: string, values: MealItemFormValues) => {
      const parsed = parseFormValues(values);
      await database.write(async () => {
        const record = await database.get<MealPlanItem>('meal_plan_items').find(itemId);
        await record.update((r) => {
          r.productName = parsed.productName;
          r.grams = parsed.grams;
          r.calories = parsed.calories;
          r.protein = parsed.protein;
          r.fat = parsed.fat;
          r.carbs = parsed.carbs;
        });
      });
    },
    [database]
  );

  const deleteMealItem = useCallback(
    async (itemId: string) => {
      await database.write(async () => {
        const record = await database.get<MealPlanItem>('meal_plan_items').find(itemId);
        await record.destroyPermanently();
      });
    },
    [database]
  );

  const renamePlan = useCallback(
    async (planId: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      await database.write(async () => {
        const record = await database.get<MealPlan>('meal_plans').find(planId);
        await record.update((r) => {
          r.name = trimmed;
        });
      });
    },
    [database]
  );

  return { addMealItem, updateMealItem, deleteMealItem, renamePlan };
}

interface ParsedItemValues {
  productName: string;
  grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

function parseFormValues(values: MealItemFormValues): ParsedItemValues {
  return {
    productName: values.productName.trim(),
    grams: parseNumber(values.grams),
    calories: parseNumber(values.calories),
    protein: parseNumber(values.protein),
    fat: parseNumber(values.fat),
    carbs: parseNumber(values.carbs),
  };
}

function parseNumber(value: string): number {
  const parsed = parseFloat(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}
