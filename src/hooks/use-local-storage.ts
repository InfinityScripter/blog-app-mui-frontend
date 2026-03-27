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

export function useLocalStorage<T>(
  key: string,
  initialState: T,
): UseLocalStorageReturn<T> {
  const [state, set] = useState<T>(initialState);

  const multiValue = initialState && typeof initialState === "object";

  const canReset = !isEqual(state, initialState);

  useEffect(() => {
    const restoredValue = getStorage<T>(key);

    if (restoredValue) {
      if (multiValue) {
        set((prevValue) => ({ ...prevValue, ...restoredValue }) as T);
      } else {
        set(restoredValue);
      }
    }
  }, [key, multiValue]);

  const setState = useCallback(
    (updateState: T | Partial<T>) => {
      if (multiValue) {
        set((prevValue) => {
          const newValue = { ...prevValue, ...updateState } as T;
          setStorage(key, newValue);
          return newValue;
        });
      } else {
        setStorage(key, updateState as T);
        set(updateState as T);
      }
    },
    [key, multiValue],
  );

  const setField = useCallback(
    <K extends keyof T>(name: K, updateValue: T[K]) => {
      if (multiValue) {
        setState({
          [name]: updateValue,
        } as Partial<T>);
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

export function getStorage<T>(key: string): T | null {
  try {
    const result = localStorageGetItem(key);

    if (result) {
      return JSON.parse(result) as T;
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
