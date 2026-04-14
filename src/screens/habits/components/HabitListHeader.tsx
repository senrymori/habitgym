import { FC } from 'react';
import { View } from 'react-native';
import { subDays } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '@ui-kits/Typography/Typography';
import { IconEnum } from '@ui-kits/Typography/typography-consts';
import { ButtonIcon } from '@ui-kits/Button/ButtonIcon';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useLanguage } from '@providers/language/LanguageProvider';
import { useDatabase } from '@providers/DatabaseProvider';
import { Habit } from '@db/models/Habit';
import { HabitTask } from '@db/models/HabitTask';
import { formatHeaderDate } from '@utils/date-utils';
import { HabitTabStackNavigationHookProps } from '@navigation/home-tabs/habit-tab-stack/habit-tab-stack-types';

// TODO: remove the seed button after manual testing of HabitCard variants.
export const HabitListHeader: FC = function () {
  const navigation = useNavigation<HabitTabStackNavigationHookProps<'HabitList'>>();
  const { currentLanguage } = useLanguage();
  const database = useDatabase();

  function handlePressCreate() {
    navigation.navigate('HabitCreate', {});
  }

  async function handlePressSeed() {
    await database.write(async () => {
      const habits = database.get<Habit>('habits');
      const tasks = database.get<HabitTask>('habit_tasks');

      await habits.create((record) => {
        record.icon = '🔥';
        record.title = 'Streak counter';
        record.habitType = 'counter';
        record.color = '#FF8844';
        record.isArchived = false;
        record.startDate = subDays(new Date(), 7);
        record.daysOfWeekRaw = JSON.stringify([]);
        record.requireAllTasks = false;
        record.remindersEnabled = false;
        record.reminderTimesRaw = JSON.stringify([]);
      });

      await habits.create((record) => {
        record.icon = '📅';
        record.title = 'Weekly habit';
        record.habitType = 'weekly';
        record.color = '#44AAFF';
        record.isArchived = false;
        record.daysOfWeekRaw = JSON.stringify([1, 3, 5]);
        record.requireAllTasks = false;
        record.remindersEnabled = false;
        record.reminderTimesRaw = JSON.stringify([]);
      });

      const trackingHabit = await habits.create((record) => {
        record.icon = '✅';
        record.title = 'Tracking habit';
        record.habitType = 'tracking';
        record.color = '#44CC88';
        record.isArchived = false;
        record.daysOfWeekRaw = JSON.stringify([1, 2, 3, 4, 5]);
        record.trackingMode = 'weekly';
        record.requireAllTasks = false;
        record.remindersEnabled = false;
        record.reminderTimesRaw = JSON.stringify([]);
      });

      await tasks.create((record) => {
        record.habitId = trackingHabit.id;
        record.time = '09:00';
        record.label = 'Morning routine';
        record.sortOrder = 0;
      });
      await tasks.create((record) => {
        record.habitId = trackingHabit.id;
        record.time = '18:00';
        record.label = 'Evening routine';
        record.sortOrder = 1;
      });
    });
  }

  return (
    <View style={[sharedLayoutStyles.rowCenterBetween, sharedLayoutStyles.mb16]}>
      <Typography
        size={20}
        weight={700}>
        {formatHeaderDate(new Date(), currentLanguage)}
      </Typography>
      <View style={[sharedLayoutStyles.rowAlignCenter, sharedLayoutStyles.gap8]}>
        <ButtonIcon
          icon={IconEnum.Refresh}
          variant={'outline'}
          colorVariant={'primary'}
          onPress={handlePressSeed}
        />
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
