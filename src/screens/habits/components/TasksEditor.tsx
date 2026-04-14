import { FC, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitFormValues } from '../habit-create-types';
import { TaskEditorRow } from './TaskEditorRow';

export const TasksEditor: FC = function () {
  const { control, formState, register } = useFormContext<HabitFormValues>();
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();
  const fieldArray = useFieldArray<HabitFormValues, 'tasks'>({ control, name: 'tasks' });

  const handleAdd = useCallback(() => {
    fieldArray.append({ time: '09:00', label: '' });
  }, [fieldArray]);

  const renderRow = useCallback(
    (field: { id: string }, index: number) => (
      <TaskEditorRow
        key={field.id}
        index={index}
        onRemove={() => fieldArray.remove(index)}
      />
    ),
    [fieldArray]
  );

  register('tasks', {
    validate: (value, all) =>
      all.habitType !== 'tracking' || (value && value.length >= 1) || translations.habits.validation.tasksRequired,
  });

  const errorMessage =
    (formState.errors.tasks?.root?.message as string | undefined) ??
    (formState.errors.tasks?.message as string | undefined);

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
      {errorMessage ? (
        <Typography
          size={12}
          color={themeColors.error}>
          {errorMessage}
        </Typography>
      ) : null}
    </View>
  );
};
