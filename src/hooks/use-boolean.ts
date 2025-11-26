"use client";

import { useMemo, useState, useCallback } from "react";

// ----------------------------------------------------------------------

interface UseBooleanReturn {
  value: boolean;
  onTrue: () => void;
  onFalse: () => void;
  onToggle: () => void;
  setValue: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export function useBoolean(defaultValue = false): UseBooleanReturn {
  const [value, setValue] = useState(defaultValue);

  const onTrue = useCallback(() => {
    setValue(true);
  }, []);

  const onFalse = useCallback(() => {
    setValue(false);
  }, []);

  const onToggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      value,
      onTrue,
      onFalse,
      onToggle,
      setValue,
    }),
    [value, onTrue, onFalse, onToggle, setValue],
  );

  return memoizedValue;
}
