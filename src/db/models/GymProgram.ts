import { Model, Q, Query } from '@nozbe/watermelondb';
import { field, text, date, readonly, children, lazy } from '@nozbe/watermelondb/decorators';
import { GymProgramExercise } from './GymProgramExercise';
import { GymWorkoutSession } from './GymWorkoutSession';

export class GymProgram extends Model {
  static table = 'gym_programs';
  static associations = {
    gym_program_exercises: { type: 'has_many', foreignKey: 'program_id' },
    gym_workout_sessions: { type: 'has_many', foreignKey: 'program_id' },
  } as const;

  @text('icon') icon!: string;
  @text('title') title!: string;
  @field('rest_between_exercises') restBetweenExercises!: number;
  @field('is_archived') isArchived!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('gym_program_exercises') exercises!: Query<GymProgramExercise>;
  @children('gym_workout_sessions') sessions!: Query<GymWorkoutSession>;

  @lazy sortedExercises = this.exercises.extend(Q.sortBy('sort_order', Q.asc));
}
