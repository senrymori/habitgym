import { FC, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Controller, FormProvider, UseFormReturn, useWatch } from 'react-hook-form';
import { InputText } from '@ui-kits/inputs/InputText.tsx';
import { SegmentedControl } from '@ui-kits/SegmentedControl/SegmentedControl.tsx';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { HabitIconPicker } from '../HabitIconPicker.tsx';
import { useLanguage } from '@providers/language/LanguageProvider.tsx';
import { HabitFormValues } from '../../habit-create-types.ts';
import { habitTypeSegments } from '../../habit-create-consts.ts';
import { HabitFormSectionTitle } from './HabitFormSectionTitle.tsx';
import { HabitFormCounterContent } from './HabitFormCounterContent.tsx';
import { HabitFormWeeklyContent } from './HabitFormWeeklyContent.tsx';
import { HabitFormTrackingContent } from './HabitFormTrackingContent.tsx';

interface HabitFormProps {
  form: UseFormReturn<HabitFormValues>;
  isEdit?: boolean;
}

export const HabitForm: FC<HabitFormProps> = function (props) {
  const { translations } = useLanguage();
  const { control } = props.form;
  const habitType = useWatch({ control, name: 'habitType' });

  const handleHabitTypeChange = useCallback(
    (index: number) =>
      props.form.setValue('habitType', habitTypeSegments[index], { shouldValidate: true, shouldDirty: true }),
    [props.form]
  );

  const habitTypeIndex = habitTypeSegments.indexOf(habitType);

  const habitTypeContent = useMemo(() => {
    switch (habitType) {
      case 'counter':
        return <HabitFormCounterContent />;
      case 'weekly':
        return <HabitFormWeeklyContent />;
      case 'tracking':
        return <HabitFormTrackingContent />;
      default:
        return null;
    }
  }, [habitType]);

  return (
    <FormProvider {...props.form}>
      <View style={[sharedLayoutStyles.gap24, sharedLayoutStyles.pb24]}>
        <View style={sharedLayoutStyles.gap12}>
          <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap8]}>
            <Controller
              control={control}
              name={'icon'}
              rules={{ required: true, validate: (v) => v.trim().length > 0 }}
              render={({ field }) => (
                <HabitIconPicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <View style={sharedLayoutStyles.flex1}>
              <Controller
                control={control}
                name={'title'}
                rules={{
                  required: translations.habits.validation.titleRequired,
                  validate: (v) => v.trim().length >= 1 || translations.habits.validation.titleRequired,
                }}
                render={({ field, fieldState }) => (
                  <InputText
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={translations.habits.create.placeholderTitle}
                    errorText={fieldState.error?.message}
                  />
                )}
              />
            </View>
          </View>
          <Controller
            control={control}
            name={'description'}
            render={({ field }) => (
              <InputText
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder={translations.habits.create.placeholderDescription}
                multiline={true}
              />
            )}
          />
        </View>

        {!props.isEdit && (
          <View style={sharedLayoutStyles.gap12}>
            <HabitFormSectionTitle title={translations.habits.create.sectionType} />
            <SegmentedControl
              segments={[
                translations.habits.type.counter,
                translations.habits.type.weekly,
                translations.habits.type.tracking,
              ]}
              selectedIndex={habitTypeIndex < 0 ? 0 : habitTypeIndex}
              onChange={handleHabitTypeChange}
            />
            {habitTypeContent}
          </View>
        )}
      </View>
    </FormProvider>
  );
};
