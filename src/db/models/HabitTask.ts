import { Model, Relation } from '@nozbe/watermelondb';
import { field, text, relation } from '@nozbe/watermelondb/decorators';
import { Habit } from './Habit';

export class HabitTask extends Model {
  static table = 'habit_tasks';
  static associations = {
    habits: { type: 'belongs_to', key: 'habit_id' },
    task_completions: { type: 'has_many', foreignKey: 'task_id' },
  } as const;

  @field('habit_id') habitId!: string;
  @text('time') time!: string;
  @text('label') label!: string;
  @field('sort_order') sortOrder!: number;
  @field('day_of_week') dayOfWeek?: number;

  @relation('habits', 'habit_id') habit!: Relation<Habit>;
}
