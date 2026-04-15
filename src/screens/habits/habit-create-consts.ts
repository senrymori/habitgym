import { HabitFormValues } from './habit-create-types';

export function getDefaultHabitFormValues(): Omit<HabitFormValues, 'icon'> {
  return {
    title: '',
    description: '',
    habitType: 'counter',
    startDate: new Date(),
    daysOfWeek: [],
    trackingMode: 'daily',
    tasks: [],
    requireAllTasks: true,
  };
}

export const habitTypeSegments = ['counter', 'weekly', 'tracking'] as const;
export const trackingModeSegments = ['daily', 'weekly'] as const;
