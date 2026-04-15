import { HabitType, TrackingMode } from '@db/db-types';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';

export interface HabitTaskDraft {
  id?: string;
  time: string;
  label: string;
}

export interface HabitFormValues {
  icon: IconEnum;
  title: string;
  description: string;
  habitType: HabitType;
  startDate: Date;
  daysOfWeek: number[];
  trackingMode: TrackingMode;
  tasks: HabitTaskDraft[];
  requireAllTasks: boolean;
}
