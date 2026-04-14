import { FC, useMemo } from 'react';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { Card } from '@ui-kits/Card';
import { Typography } from '@ui-kits/Typography/Typography';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { useAppThemeColors } from '@providers/theme/AppThemeColorsProvider';
import { useLanguage } from '@providers/language/LanguageProvider';
import { Locale } from '@providers/language/localized-strings';
import { Habit } from '@db/models/Habit';
import { HabitCompletion } from '@db/models/HabitCompletion';
import { HabitTask } from '@db/models/HabitTask';
import { TaskCompletion } from '@db/models/TaskCompletion';
import { getWeekdayIndex } from '@utils/date-utils';

interface HabitMonthCalendarProps {
  habit: Habit;
  completions: HabitCompletion[];
  tasks: HabitTask[];
  taskCompletions: TaskCompletion[];
  expandedDate: string | null;
  onDayPress: (dateStr: string) => void;
}

LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ],
  monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня',
};
LocaleConfig.locales['en'] = LocaleConfig.locales[''];

export const HabitMonthCalendar: FC<HabitMonthCalendarProps> = function (props) {
  const themeColors = useAppThemeColors();
  const { translations, currentLanguage } = useLanguage();

  LocaleConfig.defaultLocale = currentLanguage === Locale.ru ? 'ru' : 'en';

  const weeklyRestricted =
    props.habit.habitType === 'weekly' ||
    (props.habit.habitType === 'tracking' && props.habit.trackingMode === 'weekly');
  const selectedDays = props.habit.parsedDaysOfWeek;

  const markedDates: MarkedDates = useMemo(() => {
    const map: MarkedDates = {};

    if (props.habit.habitType === 'tracking') {
      const byDate = new Map<string, Set<string>>();
      props.taskCompletions.forEach((tc) => {
        if (!tc.completed) return;
        if (!byDate.has(tc.date)) byDate.set(tc.date, new Set());
        byDate.get(tc.date)!.add(tc.taskId);
      });
      const totalTasks = props.tasks.length;
      byDate.forEach((ids, date) => {
        if (totalTasks > 0 && ids.size > 0) {
          map[date] = {
            marked: true,
            dotColor: themeColors.primary400,
          };
        }
      });
    } else {
      props.completions.forEach((c) => {
        if (!c.completed) return;
        map[c.date] = {
          marked: true,
          dotColor: themeColors.primary400,
        };
      });
    }

    if (props.expandedDate) {
      map[props.expandedDate] = {
        ...(map[props.expandedDate] ?? {}),
        selected: true,
        selectedColor: themeColors.primary400,
      };
    }

    return map;
  }, [props.completions, props.taskCompletions, props.tasks, props.expandedDate, props.habit.habitType, themeColors]);

  function handleDayPress(day: DateData) {
    if (weeklyRestricted) {
      const idx = getWeekdayIndex(new Date(day.dateString));
      if (!selectedDays.includes(idx)) return;
    }
    props.onDayPress(day.dateString);
  }

  return (
    <Card
      variant={'secondary'}
      style={sharedLayoutStyles.gap8}>
      <Typography
        size={12}
        weight={500}
        colorVariant={'textSecondary'}
        transform={'uppercase'}>
        {translations.habits.detail.calendarTitle}
      </Typography>
      <Calendar
        firstDay={1}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        disableAllTouchEventsForDisabledDays={true}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: themeColors.textSecondary,
          dayTextColor: themeColors.text,
          todayTextColor: themeColors.primary400,
          monthTextColor: themeColors.text,
          arrowColor: themeColors.primary400,
          textDisabledColor: themeColors.textTertiary,
          selectedDayBackgroundColor: themeColors.primary400,
          selectedDayTextColor: themeColors.strongWhite,
          dotColor: themeColors.primary400,
        }}
      />
    </Card>
  );
};
