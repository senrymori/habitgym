import { Model, Relation } from '@nozbe/watermelondb';
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';
import { GymExercise } from './GymExercise';

export class ExercisePhoto extends Model {
  static table = 'exercise_photos';
  static associations = {
    gym_exercises: { type: 'belongs_to', key: 'exercise_id' },
  } as const;

  @field('exercise_id') exerciseId!: string;
  @text('uri') uri!: string;
  @field('sort_order') sortOrder!: number;
  @readonly @date('created_at') createdAt!: Date;

  @relation('gym_exercises', 'exercise_id') exercise!: Relation<GymExercise>;
}
