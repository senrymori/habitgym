import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: 'habits',
      columns: [
        { name: 'icon', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'habit_type', type: 'string' },
        { name: 'is_archived', type: 'boolean' },
        { name: 'start_date', type: 'number', isOptional: true },
        { name: 'days_of_week', type: 'string' },
        { name: 'tracking_mode', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'habit_tasks',
      columns: [
        { name: 'habit_id', type: 'string', isIndexed: true },
        { name: 'time', type: 'string' },
        { name: 'label', type: 'string' },
        { name: 'sort_order', type: 'number' },
        { name: 'day_of_week', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'habit_completions',
      columns: [
        { name: 'habit_id', type: 'string', isIndexed: true },
        { name: 'date', type: 'string', isIndexed: true },
        { name: 'completed', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'task_completions',
      columns: [
        { name: 'habit_id', type: 'string', isIndexed: true },
        { name: 'task_id', type: 'string', isIndexed: true },
        { name: 'date', type: 'string', isIndexed: true },
        { name: 'completed', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'gym_programs',
      columns: [
        { name: 'icon', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'rest_between_exercises', type: 'number' },
        { name: 'is_archived', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'gym_exercises',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'exercise_type', type: 'string' },
        { name: 'tags', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'gym_program_exercises',
      columns: [
        { name: 'program_id', type: 'string', isIndexed: true },
        { name: 'exercise_id', type: 'string', isIndexed: true },
        { name: 'sort_order', type: 'number' },
        { name: 'sets', type: 'number', isOptional: true },
        { name: 'reps', type: 'number', isOptional: true },
        { name: 'weight', type: 'number', isOptional: true },
        { name: 'rest_between_sets', type: 'number', isOptional: true },
        { name: 'duration', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'gym_workout_sessions',
      columns: [
        { name: 'program_id', type: 'string', isIndexed: true },
        { name: 'started_at', type: 'number' },
        { name: 'finished_at', type: 'number', isOptional: true },
        { name: 'status', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'gym_workout_sets',
      columns: [
        { name: 'session_id', type: 'string', isIndexed: true },
        { name: 'program_exercise_id', type: 'string', isIndexed: true },
        { name: 'set_number', type: 'number' },
        { name: 'weight', type: 'number', isOptional: true },
        { name: 'reps', type: 'number', isOptional: true },
        { name: 'completed', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'weight_entries',
      columns: [
        { name: 'weight', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'date', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'meal_plans',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'meal_plan_meals',
      columns: [
        { name: 'plan_id', type: 'string', isIndexed: true },
        { name: 'meal_type', type: 'string' },
        { name: 'sort_order', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'meal_plan_items',
      columns: [
        { name: 'meal_id', type: 'string', isIndexed: true },
        { name: 'product_name', type: 'string' },
        { name: 'grams', type: 'number' },
        { name: 'calories', type: 'number' },
        { name: 'protein', type: 'number' },
        { name: 'fat', type: 'number' },
        { name: 'carbs', type: 'number' },
      ],
    }),
  ],
});
