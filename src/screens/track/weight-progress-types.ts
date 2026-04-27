import { WeightUnit } from '@db/db-types';
import { WeightEntry } from '@db/models/WeightEntry';

export interface WeightHistoryEntry {
  id: string;
  weight: number;
  unit: WeightUnit;
  date: string;
  deltaFromPrevious: number | null;
}

export interface WeightSummary {
  current: WeightEntry | null;
  previous: WeightEntry | null;
  deltaFromPrevious: number | null;
}
