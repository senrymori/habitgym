import { Model, Relation } from '@nozbe/watermelondb';
import { field, text, relation } from '@nozbe/watermelondb/decorators';
import { Habit } from './Habit';

export class HabitCompletion extends Model {
  static table = 'habit_completions';
  static associations = {
    habits: { type: 'belongs_to', key: 'habit_id' },
  } as const;

  @field('habit_id') habitId!: string;
  @text('date') date!: string;
  @field('completed') completed!: boolean;

  @relation('habits', 'habit_id') habit!: Relation<Habit>;
}
