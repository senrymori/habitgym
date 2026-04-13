import { Model, Q, Query } from '@nozbe/watermelondb';
import { text, date, readonly, children, lazy } from '@nozbe/watermelondb/decorators';
import { MealPlanMeal } from './MealPlanMeal';

export class MealPlan extends Model {
  static table = 'meal_plans';
  static associations = {
    meal_plan_meals: { type: 'has_many', foreignKey: 'plan_id' },
  } as const;

  @text('name') name!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('meal_plan_meals') meals!: Query<MealPlanMeal>;

  @lazy sortedMeals = this.meals.extend(Q.sortBy('sort_order', Q.asc));
}
