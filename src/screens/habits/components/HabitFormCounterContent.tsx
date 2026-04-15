import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitFormValues } from '../habit-create-types';
import { DateField } from './DateField';

export const HabitFormCounterContent: FC = function () {
  const { translations } = useLanguage();
  const { control } = useFormContext<HabitFormValues>();

  return (
    <Controller
      control={control}
      name={'startDate'}
      render={({ field }) => (
        <DateField
          label={translations.habits.create.startDate}
          value={field.value}
          onChange={(d) => field.onChange(d ?? new Date())}
        />
      )}
    />
  );
};
