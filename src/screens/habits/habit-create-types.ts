import { HabitType, TrackingMode } from '@db/db-types';

export interface HabitTaskDraft {
  id?: string;
  time: string;
  label: string;
}

export interface HabitFormValues {
  icon: string;
  title: string;
  description: string;
  habitType: HabitType;
  color: string;
  startDate: Date;
  endDate: Date | null;
  daysOfWeek: number[];
  trackingMode: TrackingMode;
  tasks: HabitTaskDraft[];
  requireAllTasks: boolean;
  remindersEnabled: boolean;
  reminderTimes: string[];
}
