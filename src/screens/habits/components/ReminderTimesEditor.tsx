import { FC, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitFormValues } from '../habit-create-types';
import { TimeField } from './TimeField';

export const ReminderTimesEditor: FC = function () {
  const { watch, setValue } = useFormContext<HabitFormValues>();
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();
  const times = watch('reminderTimes');

  const handleAdd = useCallback(() => {
    setValue('reminderTimes', [...times, '09:00'], { shouldDirty: true });
  }, [times, setValue]);

  const handleRemove = useCallback(
    (index: number) => {
      setValue(
        'reminderTimes',
        times.filter((_, i) => i !== index),
        { shouldDirty: true }
      );
    },
    [times, setValue]
  );

  const handleChange = useCallback(
    (index: number, time: string) => {
      setValue(
        'reminderTimes',
        times.map((t, i) => (i === index ? time : t)),
        { shouldDirty: true }
      );
    },
    [times, setValue]
  );

  const renderRow = useCallback(
    (time: string, index: number) => (
      <View
        key={index}
        style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8]}>
        <TimeField
          value={time}
          onChange={(v) => handleChange(index, v)}
        />
        <Pressable onPress={() => handleRemove(index)}>
          <Typography
            icon={IconEnum.Trash}
            size={20}
            color={themeColors.error}
          />
        </Pressable>
      </View>
    ),
    [handleChange, handleRemove, themeColors.error]
  );

  return (
    <View style={sharedLayoutStyles.gap8}>
      {times.map(renderRow)}
      <Pressable
        onPress={handleAdd}
        style={[
          sharedLayoutStyles.rowAlignCenter,
          sharedLayoutStyles.gap8,
          sharedLayoutStyles.p12,
          sharedLayoutStyles.br12,
          sharedLayoutStyles.border1,
          { borderColor: themeColors.border, borderStyle: 'dashed' },
        ]}>
        <Typography
          icon={IconEnum.Plus}
          size={16}
          color={themeColors.textSecondary}
        />
        <Typography colorVariant={'textSecondary'}>{translations.habits.create.addReminder}</Typography>
      </Pressable>
    </View>
  );
};
