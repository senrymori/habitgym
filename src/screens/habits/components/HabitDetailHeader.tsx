import { FC } from 'react';
import { View } from 'react-native';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { IconEnum } from '@ui-kits/Typography/typography-consts.ts';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon.tsx';
import { useNavigation } from '@react-navigation/native';
import {
  HabitRoute,
  HabitTabStackNavigationHookProps,
} from '@navigation/home-tabs/habit-tab-stack/habit-tab-stack-types.ts';
import { useRoute } from '@react-navigation/core';

interface HabitDetailHeaderProps {
  icon: IconEnum;
  title: string;
}

export const HabitDetailHeader: FC<HabitDetailHeaderProps> = function (props) {
  const navigation = useNavigation<HabitTabStackNavigationHookProps<'HabitDetail'>>();
  const route = useRoute<HabitRoute<'HabitDetail'>>();

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

      <View style={[sharedLayoutStyles.row, sharedLayoutStyles.gap8]}>
        <ButtonIcon icon={IconEnum.Trash} />
        <ButtonIcon
          icon={IconEnum.Edit}
          onPress={() =>
            navigation.navigate('HabitCreate', {
              habitId: route.params.habitId,
            })
          }
        />
      </View>
    </View>
  );
};
