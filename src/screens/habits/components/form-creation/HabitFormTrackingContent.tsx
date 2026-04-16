import { FC, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { SegmentedControl } from '@ui-kits/SegmentedControl/SegmentedControl.tsx';
import { Typography } from '@ui-kits/Typography/Typography.tsx';
import { useLanguage } from '@providers/language/LanguageProvider.tsx';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider.tsx';
import { WeekdayPicker } from '@components/weekday-picker/WeekdayPicker.tsx';
import { HabitDayTasks, HabitFormValues } from '../../habit-create-types.ts';
import { trackingModeSegments } from '../../habit-create-consts.ts';
import { HabitFormSectionTitle } from './HabitFormSectionTitle.tsx';
import { HabitFormWeeklyContent } from './HabitFormWeeklyContent.tsx';
import { TasksEditor } from '../TasksEditor.tsx';
import { DayTasksEditor } from '../DayTasksEditor.tsx';

export const HabitFormTrackingContent: FC = function () {
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();
  const { control, setValue, register, formState } = useFormContext<HabitFormValues>();
  const trackingMode = useWatch({ control, name: 'trackingMode' });
  const daysOfWeek = useWatch({ control, name: 'daysOfWeek' });

  const trackingModeIndex = trackingModeSegments.indexOf(trackingMode);

  const [activeDay, setActiveDay] = useState<keyof HabitDayTasks | null>(null);

  useEffect(() => {
    if (trackingMode !== 'weekly') return;
    if (daysOfWeek.length === 0) {
      setActiveDay(null);
      return;
    }
    setActiveDay((prev) => {
      if (prev !== null && daysOfWeek.includes(prev)) return prev;
      return daysOfWeek[0] as keyof HabitDayTasks;
    });
  }, [daysOfWeek, trackingMode]);

  const handleTrackingModeChange = useCallback(
    (index: number) =>
      setValue('trackingMode', trackingModeSegments[index], { shouldValidate: true, shouldDirty: true }),
    [setValue]
  );

  register('dayTasks', {
    validate: (value, all) => {
      if (all.habitType !== 'tracking' || all.trackingMode !== 'weekly') return true;
      const hasAny = all.daysOfWeek.some((d) => {
        const key = d as keyof HabitDayTasks;
        return value[key]?.length > 0;
      });
      return hasAny || translations.habits.validation.dayTasksRequired;
    },
  });

  const errorMessage =
    (formState.errors.dayTasks?.root?.message as string | undefined) ??
    (formState.errors.dayTasks?.message as string | undefined);

  return (
    <View style={sharedLayoutStyles.gap12}>
      <HabitFormSectionTitle title={translations.habits.create.sectionTasks} />
      <SegmentedControl
        segments={[translations.habits.create.trackingMode.daily, translations.habits.create.trackingMode.weekly]}
        selectedIndex={trackingModeIndex < 0 ? 0 : trackingModeIndex}
        onChange={handleTrackingModeChange}
      />
      {trackingMode === 'weekly' ? (
        <>
          <HabitFormWeeklyContent />
          {daysOfWeek.length > 0 ? (
            <>
              <WeekdayPicker
                mode={'active-select'}
                selectedDays={daysOfWeek}
                activeDay={activeDay ?? undefined}
                onDayPress={(d) => setActiveDay(d as keyof HabitDayTasks)}
              />
              {activeDay !== null ? <DayTasksEditor day={activeDay} /> : null}
            </>
          ) : null}
          {!!errorMessage && (
            <Typography
              size={12}
              color={themeColors.error}>
              {errorMessage}
            </Typography>
          )}
        </>
      ) : (
        <TasksEditor />
      )}
    </View>
  );
};
