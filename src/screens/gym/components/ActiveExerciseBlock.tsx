import { FC } from 'react';
import { View } from 'react-native';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { InputText } from '@ui-kits/inputs/InputText';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { ActiveExerciseInfo } from '../gym-workout-active-types';
import { getTotalSetsForExercise } from '../gym-workout-active-utils';

interface ActiveExerciseBlockProps {
  item: ActiveExerciseInfo;
  currentSetIndex: number;
  weight: string;
  onWeightChange: (value: string) => void;
  onComplete: () => void;
  onSkipSet: () => void;
  onSkipExercise: () => void;
  isLastExercise: boolean;
}

export const ActiveExerciseBlock: FC<ActiveExerciseBlockProps> = function (props) {
  const { translations } = useLanguage();
  const totalSets = getTotalSetsForExercise(props.item);
  const setLabel = translations.gym.set
    .replace('{current}', String(props.currentSetIndex + 1))
    .replace('{total}', String(totalSets));

  return (
    <Card style={sharedLayoutStyles.gap16}>
      <Typography
        weight={700}
        size={18}>
        {props.item.exerciseTitle}
      </Typography>
      <Typography
        weight={500}
        size={14}
        colorVariant={'textSecondary'}>
        {setLabel}
      </Typography>
      <InputText
        label={translations.gym.weight}
        value={props.weight}
        onChangeText={props.onWeightChange}
        keyboardType={'decimal-pad'}
      />
      <View style={sharedLayoutStyles.gap8}>
        <ButtonText
          text={translations.gym.completeSet}
          variant={'fill'}
          colorVariant={'primary'}
          onPress={props.onComplete}
        />
        <ButtonText
          text={translations.gym.skipSet}
          variant={'outline'}
          colorVariant={'contrast'}
          onPress={props.onSkipSet}
        />
        {!props.isLastExercise && (
          <ButtonText
            text={translations.gym.skipExercise}
            variant={'outline'}
            colorVariant={'contrast'}
            onPress={props.onSkipExercise}
          />
        )}
      </View>
    </Card>
  );
};
