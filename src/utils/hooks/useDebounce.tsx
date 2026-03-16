import { useCallback, useEffect, useRef } from 'react';

/**
 * Returns a debounced version of the provided callback and a cancel function.
 * Uses the "latest ref" pattern to prevent stale closures while keeping
 * a stable debounced function reference across renders.
 *
 * @param callback - Function to debounce
 * @param delay - Debounce delay in milliseconds
 */
function useDebounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number,
): [debounced: (...args: TArgs) => void, cancel: () => void] {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always keep the ref in sync with the latest callback
  // so the debounced function never captures a stale reference
  useEffect(() => {
    callbackRef.current = callback;
  });

  // Prevent memory leaks on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const debounced = useCallback(
    (...args: TArgs) => {
      cancel();
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timerRef.current = null;
      }, delay);
    },
    [cancel, delay],
  );

  return [debounced, cancel];
}

export { useDebounce };