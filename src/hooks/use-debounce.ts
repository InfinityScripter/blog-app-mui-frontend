import { useMemo, useState, useEffect, useCallback } from "react";

// ----------------------------------------------------------------------

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const debounceHandler = useCallback(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  useEffect(() => {
    debounceHandler();
  }, [debounceHandler]);

  const memoizedValue = useMemo(() => debouncedValue, [debouncedValue]);

  return memoizedValue;
}
