import { Model, Query, Relation } from '@nozbe/watermelondb';
import { field, relation, children } from '@nozbe/watermelondb/decorators';
import { GymProgram } from './GymProgram';
import { GymExercise } from './GymExercise';
import { GymWorkoutSet } from './GymWorkoutSet';

export class GymProgramExercise extends Model {
  static table = 'gym_program_exercises';
  static associations = {
    gym_programs: { type: 'belongs_to', key: 'program_id' },
    gym_exercises: { type: 'belongs_to', key: 'exercise_id' },
    gym_workout_sets: { type: 'has_many', foreignKey: 'program_exercise_id' },
  } as const;

  @field('program_id') programId!: string;
  @field('exercise_id') exerciseId!: string;
  @field('sort_order') sortOrder!: number;
  @field('sets') sets?: number;
  @field('reps') reps?: number;
  @field('weight') weight?: number;
  @field('rest_between_sets') restBetweenSets?: number;
  @field('duration') duration?: number;

  @relation('gym_programs', 'program_id') program!: Relation<GymProgram>;
  @relation('gym_exercises', 'exercise_id') exercise!: Relation<GymExercise>;
  @children('gym_workout_sets') workoutSets!: Query<GymWorkoutSet>;
}
