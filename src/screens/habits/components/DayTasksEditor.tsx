import { FC, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitDayTasks, HabitFormValues } from '../habit-create-types';
import { TaskEditorRow } from './TaskEditorRow';

interface DayTasksEditorProps {
  day: keyof HabitDayTasks;
}

export const DayTasksEditor: FC<DayTasksEditorProps> = function ({ day }) {
  const { control } = useFormContext<HabitFormValues>();
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();
  const fieldName = `dayTasks.${day}` as const;
  const fieldArray = useFieldArray<HabitFormValues, any>({ control, name: fieldName });

  const handleAdd = useCallback(() => {
    fieldArray.append({ time: '09:00', label: '' });
  }, [fieldArray]);

  const renderRow = useCallback(
    (field: { id: string }, index: number) => (
      <TaskEditorRow
        key={field.id}
        index={index}
        fieldPrefix={fieldName}
        onRemove={() => fieldArray.remove(index)}
      />
    ),
    [fieldArray, fieldName]
  );

  return (
    <View style={sharedLayoutStyles.gap8}>
      {fieldArray.fields.map(renderRow)}
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
        <Typography colorVariant={'textSecondary'}>{translations.habits.create.addTask}</Typography>
      </Pressable>
    </View>
  );
};
