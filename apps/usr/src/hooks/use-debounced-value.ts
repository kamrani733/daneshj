'use client';

import { useEffect, useState } from 'react';

/** Rule `30-data-layer`: search and filter inputs reach the server at most every 300 ms. */
export const INPUT_DEBOUNCE_MS = 300;

/** Returns `value` once it has stopped changing for `delayMs`. */
export function useDebouncedValue<T>(value: T, delayMs = INPUT_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
