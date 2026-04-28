import { FC, memo } from 'react';
import { Pressable, View } from 'react-native';
import { Controller, FieldArrayWithId, useFormContext } from 'react-hook-form';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { InputText } from '@ui-kits/inputs/InputText';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { ProgramFormValues } from '../gym-program-detail-types';

interface ProgramExerciseCardProps {
  item: FieldArrayWithId<ProgramFormValues, 'exercises', 'fieldKey'>;
  index: number;
  drag: () => void;
  isActive: boolean;
  onRemove: (index: number) => void;
}

const ProgramExerciseCardBase: FC<ProgramExerciseCardProps> = function (props) {
  const { control } = useFormContext<ProgramFormValues>();
  const { translations } = useLanguage();

  return (
    <Card variant={'tertiary'} style={sharedLayoutStyles.gap12}>
      <Pressable
        onLongPress={props.drag}
        disabled={props.isActive}
        delayLongPress={200}
        style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8]}>
        <Typography
          weight={600}
          size={16}
          style={sharedLayoutStyles.flex1}>
          {props.item.exerciseTitle}
        </Typography>
        <ButtonIcon
          icon={IconEnum.Trash}
          variant={'outline'}
          colorVariant={'contrast'}
          size={'small'}
          onPress={() => props.onRemove(props.index)}
        />
      </Pressable>

      {props.item.exerciseType === 'strength' ? (
        <View style={sharedLayoutStyles.gap8}>
          <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap8]}>
            <View style={sharedLayoutStyles.flex1}>
              <Controller
                control={control}
                name={`exercises.${props.index}.sets` as const}
                render={({ field }) => (
                  <InputText
                    label={translations.gym.sets}
                    value={numberToString(field.value)}
                    onChangeText={(t) => field.onChange(parseIntegerInput(t))}
                    keyboardType={'number-pad'}
                  />
                )}
              />
            </View>
            <View style={sharedLayoutStyles.flex1}>
              <Controller
                control={control}
                name={`exercises.${props.index}.reps` as const}
                render={({ field }) => (
                  <InputText
                    label={translations.gym.reps}
                    value={numberToString(field.value)}
                    onChangeText={(t) => field.onChange(parseIntegerInput(t))}
                    keyboardType={'number-pad'}
                  />
                )}
              />
            </View>
          </View>
          <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap8]}>
            <View style={sharedLayoutStyles.flex1}>
              <Controller
                control={control}
                name={`exercises.${props.index}.weight` as const}
                render={({ field }) => (
                  <InputText
                    label={translations.gym.weight}
                    value={numberToString(field.value)}
                    onChangeText={(t) => field.onChange(parseDecimalInput(t))}
                    keyboardType={'decimal-pad'}
                  />
                )}
              />
            </View>
            <View style={sharedLayoutStyles.flex1}>
              <Controller
                control={control}
                name={`exercises.${props.index}.restBetweenSets` as const}
                render={({ field }) => (
                  <InputText
                    label={`${translations.gym.restBetweenSets}, ${translations.gym.minutes}`}
                    value={numberToString(field.value)}
                    onChangeText={(t) => field.onChange(parseIntegerInput(t))}
                    keyboardType={'number-pad'}
                  />
                )}
              />
            </View>
          </View>
        </View>
      ) : (
        <Controller
          control={control}
          name={`exercises.${props.index}.duration` as const}
          render={({ field }) => (
            <InputText
              label={`${translations.gym.duration}, ${translations.gym.minutes}`}
              value={numberToString(field.value)}
              onChangeText={(t) => field.onChange(parseIntegerInput(t))}
              keyboardType={'number-pad'}
            />
          )}
        />
      )}
    </Card>
  );
};

function numberToString(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return '';
  return String(value);
}

function parseIntegerInput(text: string): number {
  if (text.length === 0) return 0;
  const parsed = parseInt(text, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function parseDecimalInput(text: string): number {
  if (text.length === 0) return 0;
  const normalized = text.replace(',', '.');
  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export const ProgramExerciseCard = memo(ProgramExerciseCardBase);
