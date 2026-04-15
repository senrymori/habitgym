import { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { Habit } from '@db/models/Habit';
import { HabitTabStackNavigationHookProps } from '@navigation/home-tabs/habit-tab-stack/habit-tab-stack-types';
import { useObserveRecord } from '@utils/hooks/useObserveRecord';
import { HabitCardCounter } from './HabitCardCounter';
import { HabitCardWeekly } from './HabitCardWeekly';
import { HabitCardTracking } from './HabitCardTracking';

interface HabitCardProps {
  item: Habit;
}

export const HabitCard: FC<HabitCardProps> = function (props) {
  const navigation = useNavigation<HabitTabStackNavigationHookProps<'HabitList'>>();
  const item = useObserveRecord(props.item);

  function handlePressCard() {
    navigation.navigate('HabitDetail', { habitId: item.id });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePressCard}>
      <Card style={sharedLayoutStyles.gap8}>
        <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.gap8]}>
          <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8]}>
            <Typography
              size={24}
              icon={item.icon}
            />
            <Typography weight={600}>{item.title}</Typography>
          </View>
          {item.habitType === 'counter' && <HabitCardCounter item={item} />}
        </View>
        {item.habitType === 'weekly' && <HabitCardWeekly item={item} />}
        {item.habitType === 'tracking' && <HabitCardTracking item={item} />}
      </Card>
    </TouchableOpacity>
  );
};
