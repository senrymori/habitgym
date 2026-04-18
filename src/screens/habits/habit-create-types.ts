import { HabitType, TrackingMode } from '@db/db-types';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';

export interface HabitTaskDraft {
  id?: string;
  time: string;
  label: string;
  dayOfWeek?: number;
}

export interface HabitDayTasks {
  1: HabitTaskDraft[];
  2: HabitTaskDraft[];
  3: HabitTaskDraft[];
  4: HabitTaskDraft[];
  5: HabitTaskDraft[];
  6: HabitTaskDraft[];
  7: HabitTaskDraft[];
}

export interface HabitFormValues {
  icon: IconEnum;
  title: string;
  description: string;
  habitType: HabitType;
  startDate: Date;
  daysOfWeek: number[];
  trackingMode: TrackingMode;
  useTaskTime: boolean;
  tasks: HabitTaskDraft[];
  dayTasks: HabitDayTasks;
}
