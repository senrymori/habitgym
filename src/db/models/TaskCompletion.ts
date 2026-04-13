import { Model, Relation } from '@nozbe/watermelondb';
import { field, text, relation } from '@nozbe/watermelondb/decorators';
import { Habit } from './Habit';
import { HabitTask } from './HabitTask';

export class TaskCompletion extends Model {
  static table = 'task_completions';
  static associations = {
    habits: { type: 'belongs_to', key: 'habit_id' },
    habit_tasks: { type: 'belongs_to', key: 'task_id' },
  } as const;

  @field('habit_id') habitId!: string;
  @field('task_id') taskId!: string;
  @text('date') date!: string;
  @field('completed') completed!: boolean;

  @relation('habits', 'habit_id') habit!: Relation<Habit>;
  @relation('habit_tasks', 'task_id') task!: Relation<HabitTask>;
}
