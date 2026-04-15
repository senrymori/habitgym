import { FC } from 'react';
import { View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { WeekdayPicker } from '@components/weekday-picker/WeekdayPicker';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitFormValues } from '../habit-create-types';
import { HabitFormSectionTitle } from './HabitFormSectionTitle';

export const HabitFormWeeklyContent: FC = function () {
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();
  const { control } = useFormContext<HabitFormValues>();

  return (
    <View style={sharedLayoutStyles.gap8}>
      <HabitFormSectionTitle title={translations.habits.create.sectionSchedule} />
      <Controller
        control={control}
        name={'daysOfWeek'}
        rules={{
          validate: (v) => v.length >= 1 || translations.habits.validation.daysRequired,
        }}
        render={({ field, fieldState }) => (
          <View style={sharedLayoutStyles.gap4}>
            <WeekdayPicker
              mode={'select'}
              selectedDays={field.value}
              onChange={field.onChange}
            />
            {fieldState.error?.message ? (
              <Typography
                size={12}
                color={themeColors.error}>
                {fieldState.error.message}
              </Typography>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};
