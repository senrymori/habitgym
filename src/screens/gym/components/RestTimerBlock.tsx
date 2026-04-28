import { FC } from 'react';
import { View } from 'react-native';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { RestTimerState } from '../gym-workout-active-types';
import { formatSecondsToMmSs } from '../gym-workout-active-utils';

interface RestTimerBlockProps {
  timer: RestTimerState;
  onSkip: () => void;
}

export const RestTimerBlock: FC<RestTimerBlockProps> = function (props) {
  const { translations } = useLanguage();

  return (
    <Card variant={'tertiary'} style={sharedLayoutStyles.gap12}>
      <Typography
        weight={700}
        size={16}>
        {translations.gym.rest}
      </Typography>
      <View style={sharedLayoutStyles.center}>
        <Typography
          weight={800}
          size={32}>
          {formatSecondsToMmSs(props.timer.secondsLeft)}
        </Typography>
      </View>
      <ButtonText
        text={translations.gym.skipRest}
        variant={'outline'}
        colorVariant={'contrast'}
        onPress={props.onSkip}
      />
    </Card>
  );
};
