import { addColumns, createTable, schemaMigrations, unsafeExecuteSql } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 9,
      steps: [
        addColumns({
          table: 'gym_workout_sets',
          columns: [{ name: 'calories', type: 'number', isOptional: true }],
        }),
      ],
    },
    {
      toVersion: 8,
      steps: [
        addColumns({
          table: 'gym_workout_sessions',
          columns: [{ name: 'exercise_order', type: 'string', isOptional: true }],
        }),
      ],
    },
    {
      toVersion: 7,
      steps: [
        createTable({
          name: 'exercise_photos',
          columns: [
            { name: 'exercise_id', type: 'string', isIndexed: true },
            { name: 'uri', type: 'string' },
            { name: 'sort_order', type: 'number' },
            { name: 'created_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'exercise_videos',
          columns: [
            { name: 'exercise_id', type: 'string', isIndexed: true },
            { name: 'uri', type: 'string' },
            { name: 'sort_order', type: 'number' },
            { name: 'created_at', type: 'number' },
          ],
        }),
      ],
    },
    {
      toVersion: 6,
      steps: [
        unsafeExecuteSql(
          "DELETE FROM habit_completions WHERE habit_id IN (SELECT id FROM habits WHERE habit_type = 'counter');"
        ),
      ],
    },
  ],
});
