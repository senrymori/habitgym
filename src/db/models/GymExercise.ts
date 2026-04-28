import { Model, Q, Query } from '@nozbe/watermelondb';
import { children, date, field, lazy, readonly, text } from '@nozbe/watermelondb/decorators';
import { ExerciseType } from '@db/db-types';
import { ExercisePhoto } from './ExercisePhoto';
import { ExerciseVideo } from './ExerciseVideo';

export class GymExercise extends Model {
  static table = 'gym_exercises';
  static associations = {
    exercise_photos: { type: 'has_many', foreignKey: 'exercise_id' },
    exercise_videos: { type: 'has_many', foreignKey: 'exercise_id' },
  } as const;

  @text('title') title!: string;
  @text('description') description!: string;
  @field('exercise_type') exerciseType!: ExerciseType;
  @text('tags') tagsRaw!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('exercise_photos') photos!: Query<ExercisePhoto>;
  @children('exercise_videos') videos!: Query<ExerciseVideo>;

  @lazy sortedPhotos = this.photos.extend(Q.sortBy('sort_order', Q.asc));
  @lazy sortedVideos = this.videos.extend(Q.sortBy('sort_order', Q.asc));

  get parsedTags(): string[] {
    return this.tagsRaw ? JSON.parse(this.tagsRaw) : [];
  }
}
