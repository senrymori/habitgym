import { Model, Query, Relation } from '@nozbe/watermelondb';
import { field, relation, children } from '@nozbe/watermelondb/decorators';
import { MealType } from '@db/db-types';
import { MealPlan } from './MealPlan';
import { MealPlanItem } from './MealPlanItem';

export class MealPlanMeal extends Model {
  static table = 'meal_plan_meals';
  static associations = {
    meal_plans: { type: 'belongs_to', key: 'plan_id' },
    meal_plan_items: { type: 'has_many', foreignKey: 'meal_id' },
  } as const;

  @field('plan_id') planId!: string;
  @field('meal_type') mealType!: MealType;
  @field('sort_order') sortOrder!: number;

  @relation('meal_plans', 'plan_id') plan!: Relation<MealPlan>;
  @children('meal_plan_items') items!: Query<MealPlanItem>;
}
