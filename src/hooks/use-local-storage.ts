import { isEqual } from "src/utils/helper";
import { useMemo, useState, useEffect, useCallback } from "react";
import { localStorageGetItem } from "src/utils/storage-available";

// ----------------------------------------------------------------------

interface UseLocalStorageReturn<T> {
  state: T;
  setState: (updateState: T | Partial<T>) => void;
  setField: <K extends keyof T>(name: K, updateValue: T[K]) => void;
  resetState: () => void;
  canReset: boolean;
}

export function useLocalStorage<T extends Record<string, unknown>>(
  key: string,
  initialState: T,
): UseLocalStorageReturn<T> {
  const [state, set] = useState<T>(initialState);

  const multiValue = initialState && typeof initialState === "object";

  const canReset = !isEqual(state, initialState);

  useEffect(() => {
    const restoredValue = getStorage(key);

    if (restoredValue && typeof restoredValue === "object") {
      set((prevValue) => ({ ...prevValue, ...restoredValue }));
    }
  }, [key]);

  const setState = useCallback(
    (updateState: T | Partial<T>) => {
      set((prevValue) => {
        const newValue: T = { ...prevValue, ...updateState };
        setStorage(key, newValue);
        return newValue;
      });
    },
    [key],
  );

  const setField = useCallback(
    <K extends keyof T>(name: K, updateValue: T[K]) => {
      if (multiValue) {
        const partial: Partial<T> = {};
        partial[name] = updateValue;
        setState(partial);
      }
    },
    [multiValue, setState],
  );

  const resetState = useCallback(() => {
    set(initialState);
    removeStorage(key);
  }, [initialState, key]);

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
      setField,
      resetState,
      canReset,
    }),
    [canReset, resetState, setField, setState, state],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function getStorage(key: string): unknown {
  try {
    const result = localStorageGetItem(key);

    if (result) {
      const parsed: unknown = JSON.parse(result);
      return parsed;
    }
  } catch (error) {
    console.error("Error while getting from storage:", error);
  }

  return null;
}

// ----------------------------------------------------------------------

export function setStorage<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error while setting storage:", error);
  }
}

// ----------------------------------------------------------------------

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Error while removing from storage:", error);
  }
}
