import { Model, Relation } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { GymWorkoutSession } from './GymWorkoutSession';
import { GymProgramExercise } from './GymProgramExercise';

export class GymWorkoutSet extends Model {
  static table = 'gym_workout_sets';
  static associations = {
    gym_workout_sessions: { type: 'belongs_to', key: 'session_id' },
    gym_program_exercises: { type: 'belongs_to', key: 'program_exercise_id' },
  } as const;

  @field('session_id') sessionId!: string;
  @field('program_exercise_id') programExerciseId!: string;
  @field('set_number') setNumber!: number;
  @field('weight') weight?: number;
  @field('reps') reps?: number;
  @field('completed') completed!: boolean;
  @field('calories') calories?: number;

  @relation('gym_workout_sessions', 'session_id') session!: Relation<GymWorkoutSession>;
  @relation('gym_program_exercises', 'program_exercise_id') programExercise!: Relation<GymProgramExercise>;
}
