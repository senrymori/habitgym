import { FC, useCallback } from 'react';
import { View } from 'react-native';
import { useLanguage } from '@providers/language/LanguageProvider';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { WeekdayCircle } from './WeekdayCircle';
import { WeekdayPickerProps } from './weekday-picker-types';
import { weekdayKeys } from './weekday-picker-consts';

export const WeekdayPicker: FC<WeekdayPickerProps> = function (props) {
  const { translations } = useLanguage();

  const handlePress = useCallback(
    (day: number) => {
      if (props.mode === 'display') return;
      if (props.disabledDays?.includes(day)) return;
      if (props.mode === 'select') {
        const next = props.selectedDays.includes(day)
          ? props.selectedDays.filter(d => d !== day)
          : [...props.selectedDays, day].sort((a, b) => a - b);
        props.onChange?.(next);
        return;
      }
      if (props.mode === 'active-select' && !props.selectedDays.includes(day)) {
        return;
      }
      props.onDayPress?.(day);
    },
    [props.mode, props.selectedDays, props.disabledDays, props.onChange, props.onDayPress]
  );

  const renderDay = useCallback(
    (day: number) => {
      const key = weekdayKeys[day - 1];
      const label = translations.weekdays.short[key];
      const selected = props.selectedDays.includes(day);
      const completed = props.completedDays?.includes(day) ?? false;
      const active = props.activeDay === day;
      const disabled = props.disabledDays?.includes(day) ?? false;
      return (
        <WeekdayCircle
          key={day}
          label={label}
          selected={selected}
          completed={completed}
          active={active}
          disabled={disabled}
          onPress={props.mode === 'display' ? undefined : () => handlePress(day)}
        />
      );
    },
    [
      props.mode,
      props.selectedDays,
      props.completedDays,
      props.activeDay,
      props.disabledDays,
      translations.weekdays.short,
      handlePress,
    ]
  );

  return <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap8, sharedLayoutStyles.center]}>{[1, 2, 3, 4, 5, 6, 7].map(renderDay)}</View>;
};
