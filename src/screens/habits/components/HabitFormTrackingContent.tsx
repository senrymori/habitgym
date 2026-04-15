import { FC, useCallback } from 'react';
import { View } from 'react-native';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { SegmentedControl } from '@ui-kits/SegmentedControl/SegmentedControl';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitFormValues } from '../habit-create-types';
import { trackingModeSegments } from '../habit-create-consts';
import { HabitFormSectionTitle } from './HabitFormSectionTitle';
import { HabitFormSwitchRow } from './HabitFormSwitchRow';
import { HabitFormWeeklyContent } from './HabitFormWeeklyContent';
import { TasksEditor } from './TasksEditor';

export const HabitFormTrackingContent: FC = function () {
  const { translations } = useLanguage();
  const { control, setValue } = useFormContext<HabitFormValues>();
  const trackingMode = useWatch({ control, name: 'trackingMode' });

  const trackingModeIndex = trackingModeSegments.indexOf(trackingMode);

  const handleTrackingModeChange = useCallback(
    (index: number) => setValue('trackingMode', trackingModeSegments[index], { shouldValidate: true, shouldDirty: true }),
    [setValue]
  );

  return (
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
