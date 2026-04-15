import { HabitFormValues } from './habit-create-types';

export const habitPresetColors: string[] = [
  '#FF8844',
  '#44AAFF',
  '#44CC88',
  '#F43F5E',
  '#A855F7',
  '#FACC15',
];

export function getDefaultHabitFormValues(): HabitFormValues {
  return {
    icon: '',
    title: '',
    description: '',
    habitType: 'counter',
    color: habitPresetColors[0],
    startDate: new Date(),
    daysOfWeek: [],
    trackingMode: 'daily',
    tasks: [],
    requireAllTasks: true,
    remindersEnabled: false,
    reminderTimes: [],
  };
}

export const habitTypeSegments = ['counter', 'weekly', 'tracking'] as const;
export const trackingModeSegments = ['daily', 'weekly'] as const;
