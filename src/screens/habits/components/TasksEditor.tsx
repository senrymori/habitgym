import { FC, useCallback, useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { NestableDraggableFlatList, RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitFormValues, HabitTaskDraft } from '../habit-create-types';
import { TaskEditorRow } from './TaskEditorRow';

type TaskFieldItem = HabitTaskDraft & { id: string };

export const TasksEditor: FC = function () {
  const { control, formState, register } = useFormContext<HabitFormValues>();
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();
  const fieldArray = useFieldArray<HabitFormValues, 'tasks'>({ control, name: 'tasks' });
  const useTaskTime = useWatch({ control, name: 'useTaskTime' });

  const fieldArrayRef = useRef(fieldArray);
  useEffect(() => {
    fieldArrayRef.current = fieldArray;
  }, [fieldArray]);

  const handleAdd = useCallback(() => {
    fieldArrayRef.current.append({ time: '09:00', label: '' });
  }, []);

  const handleDragEnd = useCallback(({ from, to }: { from: number; to: number }) => {
    if (from !== to) fieldArrayRef.current.move(from, to);
  }, []);

  const handleRemove = useCallback((index: number) => {
    fieldArrayRef.current.remove(index);
  }, []);

  const renderItem = useCallback(
    ({ getIndex, drag, isActive }: RenderItemParams<TaskFieldItem>) => {
      const index = getIndex() ?? 0;
      return (
        <ScaleDecorator>
          <View style={sharedLayoutStyles.pb8}>
            <TaskEditorRow
              index={index}
              useTaskTime={useTaskTime}
              drag={drag}
              isActive={isActive}
              onRemove={handleRemove}
            />
          </View>
        </ScaleDecorator>
      );
    },
    [handleRemove, useTaskTime]
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
      <NestableDraggableFlatList
        data={fieldArray.fields as TaskFieldItem[]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        activationDistance={10}
      />
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
      {!!errorMessage && (
        <Typography
          size={12}
          color={themeColors.error}>
          {errorMessage}
        </Typography>
      )}
    </View>
  );
};
