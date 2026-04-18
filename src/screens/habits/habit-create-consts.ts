import { HabitFormValues } from './habit-create-types';

export function getDefaultHabitFormValues(): Omit<HabitFormValues, 'icon'> {
  return {
    title: '',
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
