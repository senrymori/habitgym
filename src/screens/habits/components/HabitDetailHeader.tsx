import { FC } from 'react';
import { Alert, View } from 'react-native';
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
import { useLanguage } from '@providers/language/LanguageProvider';
import { useHabitActions } from '@screens/habits/use-habit-actions';

interface HabitDetailHeaderProps {
  icon: IconEnum;
  title: string;
}

export const HabitDetailHeader: FC<HabitDetailHeaderProps> = function (props) {
  const navigation = useNavigation<HabitTabStackNavigationHookProps<'HabitDetail'>>();
  const route = useRoute<HabitRoute<'HabitDetail'>>();
  const { translations } = useLanguage();
  const { deleteHabit } = useHabitActions();

  const handleDeletePress = () => {
    Alert.alert(
      translations.habits.detail.deleteTitle,
      translations.habits.detail.deleteMessage,
      [
        { text: translations.common.cancel, style: 'cancel' },
        {
          text: translations.common.delete,
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(route.params.habitId);
            navigation.goBack();
          },
        },
      ]
    );
  };

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
        <ButtonIcon
          icon={IconEnum.Trash}
          onPress={handleDeletePress}
        />
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
