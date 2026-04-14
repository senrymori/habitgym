import { FC } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { formatHeaderDate } from '@utils/date-utils';
import { HabitTabStackNavigationHookProps } from '@navigation/home-tabs/habit-tab-stack/habit-tab-stack-types';
import { ThemeToggle } from '@components/ThemeToggle.tsx';

export const HabitListHeader: FC = function () {
  const navigation = useNavigation<HabitTabStackNavigationHookProps<'HabitList'>>();
  const { currentLanguage } = useLanguage();

  function handlePressCreate() {
    navigation.navigate('HabitCreate', {});
  }

  return (
    <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.mb16]}>
      <Typography
        size={20}
        weight={700}>
        {formatHeaderDate(new Date(), currentLanguage)}
      </Typography>
      <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8]}>
        <ThemeToggle />
        <ButtonIcon
          icon={IconEnum.Plus}
          variant={'fill'}
          colorVariant={'primary'}
          onPress={handlePressCreate}
        />
      </View>
    </View>
  );
};
