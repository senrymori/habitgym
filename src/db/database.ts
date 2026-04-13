import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { Habit } from './models/Habit';
import { HabitTask } from './models/HabitTask';
import { HabitCompletion } from './models/HabitCompletion';
import { TaskCompletion } from './models/TaskCompletion';
import { GymProgram } from './models/GymProgram';
import { GymExercise } from './models/GymExercise';
import { GymProgramExercise } from './models/GymProgramExercise';
import { GymWorkoutSession } from './models/GymWorkoutSession';
import { GymWorkoutSet } from './models/GymWorkoutSet';
import { WeightEntry } from './models/WeightEntry';
import { MealPlan } from './models/MealPlan';
import { MealPlanMeal } from './models/MealPlanMeal';
import { MealPlanItem } from './models/MealPlanItem';
import { IS_IOS } from '@constants/device-consts.ts';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'HabitGym',
  jsi: IS_IOS,
  onSetUpError: (error) => {
    console.error('Database setup error', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    Habit,
    HabitTask,
    HabitCompletion,
    TaskCompletion,
    GymProgram,
    GymExercise,
    GymProgramExercise,
    GymWorkoutSession,
    GymWorkoutSet,
    WeightEntry,
    MealPlan,
    MealPlanMeal,
    MealPlanItem,
  ],
});
