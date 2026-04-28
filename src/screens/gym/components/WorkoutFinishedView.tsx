import { FC } from 'react';
import { View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';

interface WorkoutFinishedViewProps {
  onClose: () => void;
}

export const WorkoutFinishedView: FC<WorkoutFinishedViewProps> = function (props) {
  const { translations } = useLanguage();

  return (
    <View style={[sharedLayoutStyles.flex1, sharedLayoutStyles.center, sharedLayoutStyles.gap24, sharedLayoutStyles.p24]}>
      <Typography
        align={'center'}
        size={20}
        weight={700}>
        {translations.gym.finishedTitle}
      </Typography>
      <ButtonText
        text={translations.gym.finishedClose}
        variant={'fill'}
        colorVariant={'primary'}
        onPress={props.onClose}
      />
    </View>
  );
};
