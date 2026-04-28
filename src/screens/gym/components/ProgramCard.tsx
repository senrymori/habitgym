import { FC } from 'react';
import { Pressable, View } from 'react-native';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { ButtonText } from '@ui-kits/Button/ButtonText';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { pluralize } from '@utils/plural-utils';
import { GymProgramSummary } from '../gym-program-detail-types';

interface ProgramCardProps {
  item: GymProgramSummary;
  onStart: () => void;
  onContinue: () => void;
  onEdit: () => void;
  onShowHistory: () => void;
}

export const ProgramCard: FC<ProgramCardProps> = function (props) {
  const { translations, currentLanguage } = useLanguage();
  const hasActiveSession = props.item.activeSessionId !== null;
  const exercisesLabel = pluralize(
    props.item.exercisesCount,
    translations.gym.exercisesCount,
    currentLanguage
  );

  return (
    <Card style={sharedLayoutStyles.gap12}>
      <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8]}>
        <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8, sharedLayoutStyles.flex1]}>
          {!!props.item.icon && <Typography size={24}>{props.item.icon}</Typography>}
          <Typography
            weight={600}
            size={16}>
            {props.item.title}
          </Typography>
        </View>
        <ButtonIcon
          icon={IconEnum.Edit}
          variant={'outline'}
          colorVariant={'contrast'}
          size={'small'}
          onPress={props.onEdit}
        />
      </View>

      <Typography
        colorVariant={'textSecondary'}
        size={14}>
        {exercisesLabel}
      </Typography>

      <ButtonText
        text={hasActiveSession ? translations.gym.continue : translations.gym.start}
        variant={'fill'}
        colorVariant={'primary'}
        onPress={hasActiveSession ? props.onContinue : props.onStart}
      />

      {props.item.hasFinishedSession && (
        <Pressable onPress={props.onShowHistory}>
          <Typography
            align={'center'}
            colorVariant={'textSecondary'}
            size={14}>
            {translations.gym.viewProgress}
          </Typography>
        </Pressable>
      )}
    </Card>
  );
};
