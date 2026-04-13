import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, text } from '@nozbe/watermelondb/decorators';
import { ExerciseType } from '@db/db-types';

export class GymExercise extends Model {
  static table = 'gym_exercises';

  @text('title') title!: string;
  @text('description') description!: string;
  @field('exercise_type') exerciseType!: ExerciseType;
  @text('tags') tagsRaw!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  get parsedTags(): string[] {
    return this.tagsRaw ? JSON.parse(this.tagsRaw) : [];
  }
}
