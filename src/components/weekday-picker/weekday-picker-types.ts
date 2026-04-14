export type WeekdayPickerMode = 'select' | 'toggle-completion' | 'display' | 'active-select';

export interface WeekdayPickerProps {
  selectedDays: number[];
  onChange?: (days: number[]) => void;
  mode: WeekdayPickerMode;
  completedDays?: number[];
  disabledDays?: number[];
  activeDay?: number;
  onDayPress?: (day: number) => void;
}
