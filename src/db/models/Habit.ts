import { Model, Q, Query } from '@nozbe/watermelondb';
import { field, text, date, readonly, children, lazy } from '@nozbe/watermelondb/decorators';
import { HabitType, TrackingMode } from '@db/db-types';
import { HabitTask } from './HabitTask';
import { HabitCompletion } from './HabitCompletion';
import { TaskCompletion } from './TaskCompletion';

export class Habit extends Model {
  static table = 'habits';
  static associations = {
    habit_tasks: { type: 'has_many', foreignKey: 'habit_id' },
    habit_completions: { type: 'has_many', foreignKey: 'habit_id' },
    task_completions: { type: 'has_many', foreignKey: 'habit_id' },
  } as const;

  @text('icon') icon!: string;
  @text('title') title!: string;
  @text('description') description?: string;
  @field('habit_type') habitType!: HabitType;
  @text('color') color!: string;
  @field('is_archived') isArchived!: boolean;
  @date('start_date') startDate?: Date;
  @date('end_date') endDate?: Date;
  @text('days_of_week') daysOfWeekRaw!: string;
  @field('tracking_mode') trackingMode?: TrackingMode;
  @field('require_all_tasks') requireAllTasks!: boolean;
  @field('reminders_enabled') remindersEnabled!: boolean;
  @text('reminder_times') reminderTimesRaw!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('habit_tasks') tasks!: Query<HabitTask>;
  @children('habit_completions') completions!: Query<HabitCompletion>;
  @children('task_completions') taskCompletions!: Query<TaskCompletion>;

  @lazy sortedTasks = this.tasks.extend(Q.sortBy('sort_order', Q.asc));

  get parsedDaysOfWeek(): number[] {
    return this.daysOfWeekRaw ? JSON.parse(this.daysOfWeekRaw) : [];
  }

  get parsedReminderTimes(): string[] {
    return this.reminderTimesRaw ? JSON.parse(this.reminderTimesRaw) : [];
  }
}
