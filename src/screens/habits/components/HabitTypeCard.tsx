import { FC } from 'react';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { HabitType } from '@db/db-types';

interface HabitTypeCardProps {
  habitType: HabitType;
}

export const HabitTypeCard: FC<HabitTypeCardProps> = function (props) {
  const { translations } = useLanguage();

  return (
    <Card
      variant={'secondary'}
      style={[sharedLayoutStyles.flex1, sharedLayoutStyles.gap4]}>
      <Typography
        size={12}
        weight={500}
        colorVariant={'textSecondary'}
        transform={'uppercase'}>
        {translations.habits.detail.typeTitle}
      </Typography>
      <Typography
        size={18}
        weight={600}>
        {translations.habits.type[props.habitType]}
      </Typography>
    </Card>
  );
};
