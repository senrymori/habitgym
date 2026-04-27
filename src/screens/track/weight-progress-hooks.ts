import { useCallback, useEffect, useMemo, useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import { format } from 'date-fns';
import { useDatabase } from '@providers/DatabaseProvider';
import { WeightEntry } from '@db/models/WeightEntry';
import { WeightUnit } from '@db/db-types';
import { WeightHistoryEntry, WeightSummary } from './weight-progress-types';
import { buildHistoryEntries, calculateDelta } from './weight-progress-utils';

interface UseWeightProgressResult {
  summary: WeightSummary;
  historyEntries: WeightHistoryEntry[];
  periodMonth: number;
  periodYear: number;
  setPeriod: (month: number, year: number) => void;
}

export function useWeightProgress(): UseWeightProgressResult {
  const database = useDatabase();
  const [allEntries, setAllEntries] = useState<WeightEntry[]>([]);
  const today = useMemo(() => new Date(), []);
  const [periodMonth, setPeriodMonth] = useState<number>(today.getMonth());
  const [periodYear, setPeriodYear] = useState<number>(today.getFullYear());

  useEffect(() => {
    const subscription = database
      .get<WeightEntry>('weight_entries')
      .query(Q.sortBy('date', Q.desc))
      .observe()
      .subscribe(setAllEntries);
    return () => subscription.unsubscribe();
  }, [database]);

  const filteredEntries = useMemo(() => {
    const prefix = `${periodYear}-${String(periodMonth + 1).padStart(2, '0')}`;
    return allEntries.filter((entry) => entry.date.startsWith(prefix));
  }, [allEntries, periodMonth, periodYear]);

  const summary = useMemo<WeightSummary>(() => {
    const current = allEntries[0] ?? null;
    const previous = allEntries[1] ?? null;
    const deltaFromPrevious =
      current && previous ? calculateDelta(current.weight, previous.weight) : null;
    return { current, previous, deltaFromPrevious };
  }, [allEntries]);

  const historyEntries = useMemo(() => buildHistoryEntries(filteredEntries), [filteredEntries]);

  const setPeriod = useCallback((month: number, year: number) => {
    setPeriodMonth(month);
    setPeriodYear(year);
  }, []);

  return { summary, historyEntries, periodMonth, periodYear, setPeriod };
}

interface UseWeightActionsResult {
  createWeightEntry: (weight: number, unit: WeightUnit) => Promise<void>;
  deleteWeightEntry: (id: string) => Promise<void>;
}

export function useWeightActions(): UseWeightActionsResult {
  const database = useDatabase();

  const createWeightEntry = useCallback(
    async (weight: number, unit: WeightUnit) => {
      await database.write(async () => {
        await database.get<WeightEntry>('weight_entries').create((record) => {
          record.weight = weight;
          record.unit = unit;
          record.date = format(new Date(), 'yyyy-MM-dd');
        });
      });
    },
    [database]
  );

  const deleteWeightEntry = useCallback(
    async (id: string) => {
      await database.write(async () => {
        const record = await database.get<WeightEntry>('weight_entries').find(id);
        await record.destroyPermanently();
      });
    },
    [database]
  );

  return { createWeightEntry, deleteWeightEntry };
}
