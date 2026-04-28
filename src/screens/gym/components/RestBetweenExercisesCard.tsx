import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { InputText } from '@ui-kits/inputs/InputText';
import { useLanguage } from '@providers/language/LanguageProvider';
import { ProgramFormValues } from '../gym-program-detail-types';
import { numberToString, parseIntegerInput } from '../gym-form-utils';

export const RestBetweenExercisesCard: FC = function () {
  const { control } = useFormContext<ProgramFormValues>();
  const { translations } = useLanguage();

  return (
    <Controller
      control={control}
      name={'restBetweenExercises'}
      render={({ field }) => (
        <InputText
          label={`${translations.gym.restBetweenExercises}, ${translations.gym.minutes}`}
          value={numberToString(field.value)}
          onChangeText={(t) => field.onChange(parseIntegerInput(t))}
          keyboardType={'number-pad'}
        />
      )}
    />
  );
};
