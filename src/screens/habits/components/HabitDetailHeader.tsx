import { FC } from 'react';
import { View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';

interface HabitDetailHeaderProps {
  icon: IconEnum;
  title: string;
}

export const HabitDetailHeader: FC<HabitDetailHeaderProps> = function (props) {
  return (
    <View style={[sharedLayoutStyles.columnAlignCenter, sharedLayoutStyles.gap8]}>
      <Typography
        size={32}
        icon={props.icon}
      />
      <Typography
        size={24}
        weight={700}
        align={'center'}>
        {props.title}
      </Typography>
    </View>
  );
};
