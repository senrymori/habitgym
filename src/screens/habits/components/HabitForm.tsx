import { FC, useCallback } from 'react';
import { View } from 'react-native';
import { Controller, FormProvider, UseFormReturn, useWatch } from 'react-hook-form';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { Typography } from '@ui-kits/Typography/Typography';
import { InputText } from '@ui-kits/inputs/InputText';
import { SegmentedControl } from '@ui-kits/SegmentedControl/SegmentedControl';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { HabitIconPicker } from './HabitIconPicker';
import { WeekdayPicker } from '@components/weekday-picker/WeekdayPicker';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitFormValues } from '../habit-create-types';
import { habitTypeSegments, trackingModeSegments } from '../habit-create-consts';
import { TasksEditor } from './TasksEditor';
import { DateField } from './DateField';
import { HabitFormSectionTitle } from './HabitFormSectionTitle';
import { HabitFormSwitchRow } from './HabitFormSwitchRow';

interface HabitFormProps {
  form: UseFormReturn<HabitFormValues>;
}

export const HabitForm: FC<HabitFormProps> = function (props) {
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();
  const { control } = props.form;
  const habitType = useWatch({ control, name: 'habitType' });
  const trackingMode = useWatch({ control, name: 'trackingMode' });

  const handleHabitTypeChange = useCallback(
    (index: number) =>
      props.form.setValue('habitType', habitTypeSegments[index], { shouldValidate: true, shouldDirty: true }),
    [props.form]
  );
  const handleTrackingModeChange = useCallback(
    (index: number) =>
      props.form.setValue('trackingMode', trackingModeSegments[index], { shouldValidate: true, shouldDirty: true }),
    [props.form]
  );

  const habitTypeIndex = habitTypeSegments.indexOf(habitType);
  const trackingModeIndex = trackingModeSegments.indexOf(trackingMode);

  const showWeekdayPicker = habitType === 'weekly' || (habitType === 'tracking' && trackingMode === 'weekly');

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
          {habitType === 'counter' ? (
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
          ) : null}

          {showWeekdayPicker ? (
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
          ) : null}

          {habitType === 'tracking' ? (
            <View style={sharedLayoutStyles.gap12}>
              <HabitFormSectionTitle title={translations.habits.create.sectionTasks} />
              <SegmentedControl
                segments={[
                  translations.habits.create.trackingMode.daily,
                  translations.habits.create.trackingMode.weekly,
                ]}
                selectedIndex={trackingModeIndex < 0 ? 0 : trackingModeIndex}
                onChange={handleTrackingModeChange}
              />
              <TasksEditor />
              <Controller
                control={control}
                name={'requireAllTasks'}
                render={({ field }) => (
                  <HabitFormSwitchRow
                    label={translations.habits.create.requireAllTasks}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </View>
          ) : null}
        </View>

      </View>
    </FormProvider>
  );
};
