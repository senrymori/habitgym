import { createTable, schemaMigrations, unsafeExecuteSql } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
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
