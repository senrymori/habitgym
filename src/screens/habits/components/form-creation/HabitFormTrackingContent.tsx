import { FC, useCallback } from 'react';
import { View } from 'react-native';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { sharedLayoutStyles } from '@ui-kits/shared-styles.ts';
import { SegmentedControl } from '@ui-kits/SegmentedControl/SegmentedControl.tsx';
import { useLanguage } from '@providers/language/LanguageProvider.tsx';
import { HabitFormValues } from '../../habit-create-types.ts';
import { trackingModeSegments } from '../../habit-create-consts.ts';
import { HabitFormSectionTitle } from './HabitFormSectionTitle.tsx';
import { HabitFormSwitchRow } from './HabitFormSwitchRow.tsx';
import { HabitFormWeeklyContent } from './HabitFormWeeklyContent.tsx';
import { TasksEditor } from '../TasksEditor.tsx';

export const HabitFormTrackingContent: FC = function () {
  const { translations } = useLanguage();
  const { control, setValue } = useFormContext<HabitFormValues>();
  const trackingMode = useWatch({ control, name: 'trackingMode' });

  const trackingModeIndex = trackingModeSegments.indexOf(trackingMode);

  const handleTrackingModeChange = useCallback(
    (index: number) =>
      setValue('trackingMode', trackingModeSegments[index], { shouldValidate: true, shouldDirty: true }),
    [setValue]
  );

  return (
    <View style={sharedLayoutStyles.gap12}>
      <HabitFormSectionTitle title={translations.habits.create.sectionTasks} />
      <SegmentedControl
        segments={[translations.habits.create.trackingMode.daily, translations.habits.create.trackingMode.weekly]}
        selectedIndex={trackingModeIndex < 0 ? 0 : trackingModeIndex}
        onChange={handleTrackingModeChange}
      />
      {trackingMode === 'weekly' ? <HabitFormWeeklyContent /> : null}
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
  );
};
