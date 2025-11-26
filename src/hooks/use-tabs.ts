import { useMemo, useState, useCallback, type SyntheticEvent } from "react";

// ----------------------------------------------------------------------

interface UseTabsReturn<T> {
  value: T;
  setValue: (value: T) => void;
  onChange: (event: SyntheticEvent, newValue: T) => void;
}

export function useTabs<T = string>(defaultValue: T): UseTabsReturn<T> {
  const [value, setValue] = useState<T>(defaultValue);

  const onChange = useCallback((event: SyntheticEvent, newValue: T) => {
    setValue(newValue);
  }, []);

  const memoizedValue = useMemo(
    () => ({ value, setValue, onChange }),
    [onChange, value],
  );

  return memoizedValue;
}
