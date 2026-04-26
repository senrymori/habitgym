import { schemaMigrations, unsafeExecuteSql } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
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
