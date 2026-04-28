import { FC, useCallback, useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { FieldArrayWithId, UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { NestableDraggableFlatList, RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { ProgramFormValues } from '../gym-program-detail-types';
import { ProgramExerciseCard } from './ProgramExerciseCard';

type ExerciseFieldItem = FieldArrayWithId<ProgramFormValues, 'exercises', 'fieldKey'>;

interface ProgramExerciseEditorProps {
  exercisesFieldArray: UseFieldArrayReturn<ProgramFormValues, 'exercises', 'fieldKey'>;
  onAddPress: () => void;
}

export const ProgramExerciseEditor: FC<ProgramExerciseEditorProps> = function (props) {
  const { formState, register } = useFormContext<ProgramFormValues>();
  const { translations } = useLanguage();
  const themeColors = useAppThemeColors();

  const fieldArrayRef = useRef(props.exercisesFieldArray);
  useEffect(() => {
    fieldArrayRef.current = props.exercisesFieldArray;
  }, [props.exercisesFieldArray]);

  const handleDragEnd = useCallback(({ from, to }: { from: number; to: number }) => {
    if (from !== to) fieldArrayRef.current.move(from, to);
  }, []);

  const handleRemove = useCallback((index: number) => {
    fieldArrayRef.current.remove(index);
  }, []);

  const renderItem = useCallback(
    ({ item, getIndex, drag, isActive }: RenderItemParams<ExerciseFieldItem>) => {
      const index = getIndex() ?? 0;
      return (
        <ScaleDecorator>
          <View style={sharedLayoutStyles.pb8}>
            <ProgramExerciseCard
              item={item}
              index={index}
              drag={drag}
              isActive={isActive}
              onRemove={handleRemove}
            />
          </View>
        </ScaleDecorator>
      );
    },
    [handleRemove]
  );

  register('exercises', {
    validate: (value) => (value && value.length >= 1) || translations.gym.validation.atLeastOneExercise,
  });

  const errorMessage =
    (formState.errors.exercises?.root?.message as string | undefined) ??
    (formState.errors.exercises?.message as string | undefined);

  return (
    <View style={sharedLayoutStyles.gap8}>
      <NestableDraggableFlatList
        data={props.exercisesFieldArray.fields}
        keyExtractor={(item) => item.fieldKey}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        activationDistance={10}
      />
      <Pressable
        onPress={props.onAddPress}
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
        <Typography colorVariant={'textSecondary'}>{translations.gym.addExercise}</Typography>
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
