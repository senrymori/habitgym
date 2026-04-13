import { Model, Query, Relation } from '@nozbe/watermelondb';
import { field, date, relation, children } from '@nozbe/watermelondb/decorators';
import { WorkoutSessionStatus } from '@db/db-types';
import { GymProgram } from './GymProgram';
import { GymWorkoutSet } from './GymWorkoutSet';

export class GymWorkoutSession extends Model {
  static table = 'gym_workout_sessions';
  static associations = {
    gym_programs: { type: 'belongs_to', key: 'program_id' },
    gym_workout_sets: { type: 'has_many', foreignKey: 'session_id' },
  } as const;

  @field('program_id') programId!: string;
  @date('started_at') startedAt!: Date;
  @date('finished_at') finishedAt?: Date;
  @field('status') status!: WorkoutSessionStatus;

  @relation('gym_programs', 'program_id') program!: Relation<GymProgram>;
  @children('gym_workout_sets') sets!: Query<GymWorkoutSet>;
}
