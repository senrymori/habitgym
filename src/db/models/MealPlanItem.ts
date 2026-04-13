import { Model, Relation } from '@nozbe/watermelondb';
import { field, text, relation } from '@nozbe/watermelondb/decorators';
import { MealPlanMeal } from './MealPlanMeal';

export class MealPlanItem extends Model {
  static table = 'meal_plan_items';
  static associations = {
    meal_plan_meals: { type: 'belongs_to', key: 'meal_id' },
  } as const;

  @field('meal_id') mealId!: string;
  @text('product_name') productName!: string;
  @field('grams') grams!: number;
  @field('calories') calories!: number;
  @field('protein') protein!: number;
  @field('fat') fat!: number;
  @field('carbs') carbs!: number;

  @relation('meal_plan_meals', 'meal_id') meal!: Relation<MealPlanMeal>;
}
