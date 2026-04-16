import { FC, useMemo, useState } from 'react';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { addDays, endOfMonth, format, parse, startOfMonth } from 'date-fns';
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
import { countTasksByWeekday, getWeekdayIndex } from '@utils/date-utils';

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
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
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

  const hasScheduledDays =
    props.habit.habitType === 'weekly' ||
    (props.habit.habitType === 'tracking' && props.habit.trackingMode === 'weekly');
  const selectedDays = props.habit.parsedDaysOfWeek;

  const [visibleMonth, setVisibleMonth] = useState<Date>(() => new Date());

  const scheduledDates = useMemo(() => {
    if (!hasScheduledDays || selectedDays.length === 0) return new Set<string>();
    const result = new Set<string>();
    const from = addDays(startOfMonth(visibleMonth), -7);
    const to = addDays(endOfMonth(visibleMonth), 7);
    for (let d = from; d <= to; d = addDays(d, 1)) {
      if (selectedDays.includes(getWeekdayIndex(d))) {
        result.add(format(d, 'yyyy-MM-dd'));
      }
    }
    return result;
  }, [hasScheduledDays, selectedDays, visibleMonth]);

  const markedDates: MarkedDates = useMemo(() => {
    const map: MarkedDates = {};
    const completedDates = new Set<string>();

    if (props.habit.habitType === 'tracking') {
      const trackingMode = props.habit.trackingMode ?? 'daily';
      const byDate = new Map<string, Set<string>>();
      props.taskCompletions.forEach((tc) => {
        if (!tc.completed) return;
        if (!byDate.has(tc.date)) byDate.set(tc.date, new Set());
        byDate.get(tc.date)!.add(tc.taskId);
      });
      if (trackingMode === 'weekly') {
        const tasksByWeekday = countTasksByWeekday(props.tasks);
        byDate.forEach((ids, date) => {
          const weekday = getWeekdayIndex(parse(date, 'yyyy-MM-dd', new Date()));
          const dayTotal = tasksByWeekday.get(weekday) ?? 0;
          if (dayTotal > 0 && ids.size === dayTotal) completedDates.add(date);
        });
      } else {
        const totalTasks = props.tasks.length;
        byDate.forEach((ids, date) => {
          if (totalTasks > 0 && ids.size === totalTasks) completedDates.add(date);
        });
      }
    } else {
      props.completions.forEach((c) => {
        if (c.completed) completedDates.add(c.date);
      });
    }

    scheduledDates.forEach((date) => {
      if (completedDates.has(date)) return;
      map[date] = {
        customStyles: {
          container: { backgroundColor: themeColors.primary100 },
          text: { color: themeColors.text },
        },
      };
    });

    completedDates.forEach((date) => {
      map[date] = {
        customStyles: {
          container: { backgroundColor: themeColors.primary400 },
          text: { color: themeColors.strongWhite },
        },
      };
    });

    if (props.expandedDate) {
      const existing = map[props.expandedDate]?.customStyles ?? {};
      map[props.expandedDate] = {
        customStyles: {
          container: {
            ...(existing.container ?? {}),
            backgroundColor: themeColors.blue500,
          },
          text: { color: themeColors.strongWhite },
        },
      };
    }

    return map;
  }, [
    props.completions,
    props.taskCompletions,
    props.tasks,
    props.expandedDate,
    props.habit.habitType,
    props.habit.trackingMode,
    scheduledDates,
    themeColors,
  ]);

  function handleDayPress(day: DateData) {
    props.onDayPress(day.dateString);
  }

  function handleMonthChange(date: DateData) {
    setVisibleMonth(new Date(date.year, date.month - 1, 1));
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
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
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
