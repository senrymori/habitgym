import { FC, memo } from 'react';
import { Pressable, View } from 'react-native';
import { Controller, FieldArrayWithId, useFormContext } from 'react-hook-form';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { InputText } from '@ui-kits/inputs/InputText';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { ProgramFormValues } from '../gym-program-detail-types';
import { numberToString, parseDecimalInput, parseIntegerInput } from '../gym-form-utils';

interface ExerciseSetupCardProps {
  item: FieldArrayWithId<ProgramFormValues, 'exercises', 'fieldKey'>;
  index: number;
  drag: () => void;
  isActive: boolean;
}

const ExerciseSetupCardBase: FC<ExerciseSetupCardProps> = function (props) {
  const { control } = useFormContext<ProgramFormValues>();
  const { translations } = useLanguage();

  return (
    <Card variant={'tertiary'} style={sharedLayoutStyles.gap12}>
      <Pressable
        onLongPress={props.drag}
        disabled={props.isActive}
        delayLongPress={200}>
        <Typography
          weight={600}
          size={16}>
          {props.item.exerciseTitle}
        </Typography>
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

export const ExerciseSetupCard = memo(ExerciseSetupCardBase);
