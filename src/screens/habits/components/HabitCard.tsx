import { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { Habit } from '@db/models/Habit';
import { HabitTabStackNavigationHookProps } from '@navigation/home-tabs/habit-tab-stack/habit-tab-stack-types';
import { HabitCardCounter } from './HabitCardCounter';
import { HabitCardWeekly } from './HabitCardWeekly';
import { HabitCardTracking } from './HabitCardTracking';

interface HabitCardProps {
  item: Habit;
}

export const HabitCard: FC<HabitCardProps> = function (props) {
  const navigation = useNavigation<HabitTabStackNavigationHookProps<'HabitList'>>();

  function handlePressCard() {
    navigation.navigate('HabitDetail', { habitId: props.item.id });
  }

  function handlePressEdit() {
    navigation.navigate('HabitCreate', { habitId: props.item.id });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePressCard}>
      <Card>
        <View style={sharedLayoutStyles.rowCenterBetween}>
          <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8]}>
            <Typography size={20}>{props.item.icon}</Typography>
            <Typography weight={600}>{props.item.title}</Typography>
          </View>
          <ButtonIcon
            icon={IconEnum.Edit}
            size={'small'}
            variant={'outline'}
            colorVariant={'primary'}
            onPress={handlePressEdit}
          />
        </View>
        {renderContent(props.item)}
      </Card>
    </TouchableOpacity>
  );
};

function renderContent(item: Habit) {
  switch (item.habitType) {
    case 'counter':
      return <HabitCardCounter item={item} />;
    case 'weekly':
      return <HabitCardWeekly item={item} />;
    case 'tracking':
      return <HabitCardTracking item={item} />;
    default:
      return null;
  }
}
