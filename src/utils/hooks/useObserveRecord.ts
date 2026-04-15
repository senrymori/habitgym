import { useEffect, useState } from 'react';
import { Model } from '@nozbe/watermelondb';

// WatermelonDB emits the same model instance mutated in-place.
// Wrapping in { value } ensures React sees a new reference and re-renders.
export function useObserveRecord<T extends Model>(record: T): T {
  const [wrapper, setWrapper] = useState<{ value: T }>({ value: record });

  useEffect(() => {
    const sub = record.observe().subscribe((updated) => setWrapper({ value: updated as T }));
    return () => sub.unsubscribe();
  }, [record]);

  return wrapper.value;
}
