import { WeightUnit } from '@db/db-types';
import { WeightEntry } from '@db/models/WeightEntry';
import { Translations } from '@providers/language/localized-strings';
import { WeightHistoryEntry } from './weight-progress-types';

export function calculateDelta(current: number, previous: number): number {
  return current - previous;
}

export function unitLabel(unit: WeightUnit, translations: Translations): string {
  return unit === 'lb' ? translations.track.weight.lb : translations.track.weight.kg;
}

export function formatWeightLabel(weight: number, unit: WeightUnit, translations: Translations): string {
  return `${formatNumber(weight)} ${unitLabel(unit, translations)}`;
}

export function formatDeltaLabel(delta: number, unit: WeightUnit, translations: Translations): string {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${formatNumber(delta)} ${unitLabel(unit, translations)}`;
}

export function formatDeltaShort(delta: number): string {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${formatNumber(delta)}`;
}

// Drop trailing ".0" so 75 stays "75", 75.5 stays "75.5"
function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

// entries arrive sorted by date desc; delta = current - the next (older) entry's weight
export function buildHistoryEntries(entries: WeightEntry[]): WeightHistoryEntry[] {
  return entries.map(function (entry, index) {
    const next = entries[index + 1];
    const delta = next ? calculateDelta(entry.weight, next.weight) : null;
    return {
      id: entry.id,
      weight: entry.weight,
      unit: entry.unit,
      date: entry.date,
      deltaFromPrevious: delta,
    };
  });
}
