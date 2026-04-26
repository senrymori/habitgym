import { HabitFormValues } from './habit-create-types';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';

export function getDefaultHabitFormValues(): HabitFormValues {
  return {
    title: '',
    icon: IconEnum.WineFill,
    description: '',
    habitType: 'counter',
    startDate: new Date(),
    daysOfWeek: [],
    trackingMode: 'daily',
    useTaskTime: false,
    tasks: [],
    dayTasks: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
  };
}

export const habitTypeSegments = ['counter', 'weekly', 'tracking'] as const;
export const trackingModeSegments = ['daily', 'weekly'] as const;
