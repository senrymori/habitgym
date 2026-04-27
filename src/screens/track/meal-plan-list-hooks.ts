import { useCallback, useEffect, useMemo, useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@providers/DatabaseProvider';
import { MealPlan } from '@db/models/MealPlan';
import { MealPlanMeal } from '@db/models/MealPlanMeal';
import { MealPlanItem } from '@db/models/MealPlanItem';
import { MealPlanSummary } from './meal-plan-types';
import { calculateMealTotals, mealTypeOrder } from './meal-plan-utils';

export function useMealPlansList(): MealPlanSummary[] {
  const database = useDatabase();
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [meals, setMeals] = useState<MealPlanMeal[]>([]);
  const [items, setItems] = useState<MealPlanItem[]>([]);

  useEffect(() => {
    const sub = database
      .get<MealPlan>('meal_plans')
      .query(Q.sortBy('updated_at', Q.desc))
      .observe()
      .subscribe(setPlans);
    return () => sub.unsubscribe();
  }, [database]);

  useEffect(() => {
    const sub = database.get<MealPlanMeal>('meal_plan_meals').query().observe().subscribe(setMeals);
    return () => sub.unsubscribe();
  }, [database]);

  useEffect(() => {
    const sub = database.get<MealPlanItem>('meal_plan_items').query().observe().subscribe(setItems);
    return () => sub.unsubscribe();
  }, [database]);

  return useMemo(() => {
    const itemsByMeal = new Map<string, MealPlanItem[]>();
    for (const item of items) {
      const list = itemsByMeal.get(item.mealId);
      if (list) list.push(item);
      else itemsByMeal.set(item.mealId, [item]);
    }

    const mealsByPlan = new Map<string, MealPlanMeal[]>();
    for (const meal of meals) {
      const list = mealsByPlan.get(meal.planId);
      if (list) list.push(meal);
      else mealsByPlan.set(meal.planId, [meal]);
    }

    return plans.map((plan) => {
      const planMeals = mealsByPlan.get(plan.id) ?? [];
      const planItems = planMeals.flatMap((meal) => itemsByMeal.get(meal.id) ?? []);
      return { plan, totals: calculateMealTotals(planItems) };
    });
  }, [plans, meals, items]);
}

interface UseMealPlanActionsResult {
  createMealPlan: (name: string) => Promise<string>;
  deleteMealPlan: (planId: string) => Promise<void>;
}

export function useMealPlanActions(): UseMealPlanActionsResult {
  const database = useDatabase();

  const createMealPlan = useCallback(
    async (name: string): Promise<string> => {
      let createdId = '';
      await database.write(async () => {
        const plan = await database.get<MealPlan>('meal_plans').create((record) => {
          record.name = name.trim();
        });
        createdId = plan.id;
        const mealsCollection = database.get<MealPlanMeal>('meal_plan_meals');
        await Promise.all(
          mealTypeOrder.map((type, index) =>
            mealsCollection.create((record) => {
              record.planId = plan.id;
              record.mealType = type;
              record.sortOrder = index;
            })
          )
        );
      });
      return createdId;
    },
    [database]
  );

  const deleteMealPlan = useCallback(
    async (planId: string) => {
      await database.write(async () => {
        const meals = await database
          .get<MealPlanMeal>('meal_plan_meals')
          .query(Q.where('plan_id', planId))
          .fetch();
        const mealIds = meals.map((m) => m.id);
        if (mealIds.length > 0) {
          const items = await database
            .get<MealPlanItem>('meal_plan_items')
            .query(Q.where('meal_id', Q.oneOf(mealIds)))
            .fetch();
          await Promise.all(items.map((record) => record.destroyPermanently()));
        }
        await Promise.all(meals.map((record) => record.destroyPermanently()));
        const plan = await database.get<MealPlan>('meal_plans').find(planId);
        await plan.destroyPermanently();
      });
    },
    [database]
  );

  return { createMealPlan, deleteMealPlan };
}
