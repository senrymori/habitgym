import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';
import { WeightUnit } from '@db/db-types';

export class WeightEntry extends Model {
  static table = 'weight_entries';

  @field('weight') weight!: number;
  @field('unit') unit!: WeightUnit;
  @text('date') date!: string;
  @readonly @date('created_at') createdAt!: Date;
}
