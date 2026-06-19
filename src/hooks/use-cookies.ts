import { isEqual } from "src/utils/helper";
import { useMemo, useState, useEffect, useCallback } from "react";

// ----------------------------------------------------------------------

interface UseCookiesOptions {
  daysUntilExpiration?: number;
}

interface UseCookiesReturn<T> {
  state: T;
  setState: (updateState: T | Partial<T>) => void;
  setField: <K extends keyof T>(name: K, updateValue: T[K]) => void;
  resetState: () => void;
  canReset: boolean;
}

export function useCookies<T extends Record<string, unknown>>(
  key: string,
  initialState: T,
  defaultValues: T,
  options?: UseCookiesOptions,
): UseCookiesReturn<T> {
  const [state, set] = useState<T>(initialState);

  const multiValue = initialState && typeof initialState === "object";

  const canReset = !isEqual(state, defaultValues);

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
        setStorage(key, newValue, options?.daysUntilExpiration);
        return newValue;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    removeStorage(key);
    set(defaultValues);
  }, [defaultValues, key]);

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

function getStorage(key: string): unknown {
  try {
    const keyName = `${key}=`;

    const cDecoded = decodeURIComponent(document.cookie);

    const cArr = cDecoded.split("; ");

    let res: string | undefined;

    cArr.forEach((val) => {
      if (val.indexOf(keyName) === 0) res = val.substring(keyName.length);
    });

    if (res) {
      const parsed: unknown = JSON.parse(res);
      return parsed;
    }
  } catch (error) {
    console.error("Error while getting from cookies:", error);
  }

  return null;
}

// ----------------------------------------------------------------------

function setStorage<T>(key: string, value: T, daysUntilExpiration = 0): void {
  try {
    const serializedValue = encodeURIComponent(JSON.stringify(value));
    let cookieOptions = `${key}=${serializedValue}; path=/`;

    if (daysUntilExpiration > 0) {
      const expirationDate = new Date(
        Date.now() + daysUntilExpiration * 24 * 60 * 60 * 1000,
      );
      cookieOptions += `; expires=${expirationDate.toUTCString()}`;
    }

    document.cookie = cookieOptions;
  } catch (error) {
    console.error("Error while setting cookie:", error);
  }
}

// ----------------------------------------------------------------------

function removeStorage(key: string): void {
  try {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (error) {
    console.error("Error while removing cookie:", error);
  }
}
