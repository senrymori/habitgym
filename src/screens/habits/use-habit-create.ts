import { useEffect, useMemo, useState } from 'react';
import { Collection } from '@nozbe/watermelondb';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { Habit } from '@db/models/Habit';
import { HabitTask } from '@db/models/HabitTask';
import { useDatabase } from '@providers/DatabaseProvider';
import { HabitTabStackNavigationHookProps } from '@navigation/home-tabs/habit-tab-stack/habit-tab-stack-types';
import { HabitFormValues, HabitTaskDraft } from './habit-create-types';
import { getDefaultHabitFormValues, habitPresetColors } from './habit-create-consts';

interface UseHabitCreateResult {
  form: UseFormReturn<HabitFormValues>;
  onSubmit: () => void;
  isEdit: boolean;
  isReady: boolean;
}

export function useHabitCreate(habitId?: string): UseHabitCreateResult {
  const database = useDatabase();
  const navigation = useNavigation<HabitTabStackNavigationHookProps<'HabitCreate'>>();
  const isEdit = !!habitId;
  const [isReady, setIsReady] = useState(!isEdit);

  const form = useForm<HabitFormValues>({
    mode: 'onChange',
    defaultValues: getDefaultHabitFormValues(),
  });

  useEffect(() => {
    if (!habitId) return;
    let cancelled = false;
    async function load() {
      try {
        const habit = await database.get<Habit>('habits').find(habitId!);
        const tasks = await habit.sortedTasks.fetch();
        if (cancelled) return;
        const draftTasks: HabitTaskDraft[] = tasks.map((t) => ({
          id: t.id,
          time: t.time,
          label: t.label,
        }));
        form.reset({
          icon: habit.icon,
          title: habit.title,
          description: habit.description ?? '',
          habitType: habit.habitType,
          color: habit.color || habitPresetColors[0],
          startDate: habit.startDate ?? new Date(),
          endDate: habit.endDate ?? null,
          daysOfWeek: habit.parsedDaysOfWeek,
          trackingMode: habit.trackingMode ?? 'daily',
          tasks: draftTasks,
          requireAllTasks: habit.requireAllTasks,
          remindersEnabled: habit.remindersEnabled,
          reminderTimes: habit.parsedReminderTimes,
        });
        setIsReady(true);
      } catch (e) {
        console.error('[useHabitCreate] failed to load habit', e);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [habitId, database, form]);

  const onSubmit = useMemo(
    () =>
      form.handleSubmit(async (values) => {
        try {
          const habitsCollection = database.get<Habit>('habits');
          const tasksCollection = database.get<HabitTask>('habit_tasks');

          await database.write(async () => {
            if (isEdit && habitId) {
              const habit = await habitsCollection.find(habitId);
              await habit.update((r) => {
                applyValuesToHabit(r, values);
              });
              if (values.habitType === 'tracking') {
                await syncTasks(habit, values.tasks, tasksCollection);
              } else {
                const existing = await habit.sortedTasks.fetch();
                await Promise.all(existing.map((t) => t.markAsDeleted()));
              }
            } else {
              const habit = await habitsCollection.create((r) => {
                applyValuesToHabit(r, values);
              });
              if (values.habitType === 'tracking') {
                await Promise.all(
                  values.tasks.map((task, index) =>
                    tasksCollection.create((r) => {
                      r.habitId = habit.id;
                      r.time = task.time;
                      r.label = task.label;
                      r.sortOrder = index;
                    })
                  )
                );
              }
            }
          });

          navigation.goBack();
        } catch (e) {
          console.error('[useHabitCreate] submit failed', e);
        }
      }),
    [form, database, habitId, isEdit, navigation]
  );

  return { form, onSubmit, isEdit, isReady };
}

function applyValuesToHabit(r: Habit, values: HabitFormValues): void {
  r.icon = values.icon;
  r.title = values.title.trim();
  r.description = values.description.trim() || undefined;
  r.habitType = values.habitType;
  r.color = values.color;
  r.isArchived = false;
  r.startDate = values.habitType === 'counter' ? values.startDate : undefined;
  r.endDate = values.habitType === 'counter' ? values.endDate ?? undefined : undefined;
  const days =
    values.habitType === 'weekly' || (values.habitType === 'tracking' && values.trackingMode === 'weekly')
      ? values.daysOfWeek
      : [];
  r.daysOfWeekRaw = JSON.stringify(days);
  r.trackingMode = values.habitType === 'tracking' ? values.trackingMode : undefined;
  r.requireAllTasks = values.habitType === 'tracking' ? values.requireAllTasks : false;
  r.remindersEnabled = values.remindersEnabled;
  r.reminderTimesRaw = JSON.stringify(values.remindersEnabled ? values.reminderTimes : []);
}

async function syncTasks(
  habit: Habit,
  drafts: HabitTaskDraft[],
  tasksCollection: Collection<HabitTask>
): Promise<void> {
  const existing = await habit.sortedTasks.fetch();
  const draftIds = new Set(drafts.map((d) => d.id).filter(Boolean));
  const toDelete = existing.filter((t) => !draftIds.has(t.id));
  await Promise.all(toDelete.map((t) => t.markAsDeleted()));

  const existingById = new Map(existing.map((t) => [t.id, t]));

  for (let index = 0; index < drafts.length; index += 1) {
    const draft = drafts[index];
    if (draft.id && existingById.has(draft.id)) {
      const task = existingById.get(draft.id)!;
      if (task.time !== draft.time || task.label !== draft.label || task.sortOrder !== index) {
        await task.update((r) => {
          r.time = draft.time;
          r.label = draft.label;
          r.sortOrder = index;
        });
      }
    } else {
      await tasksCollection.create((r) => {
        r.habitId = habit.id;
        r.time = draft.time;
        r.label = draft.label;
        r.sortOrder = index;
      });
    }
  }
}
