import { useMemo, useState, useEffect, useCallback } from "react";

import { isEqual } from "src/utils/helper";

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

export function useCookies<T>(
  key: string,
  initialState: T,
  defaultValues: T,
  options?: UseCookiesOptions
): UseCookiesReturn<T> {
  const [state, set] = useState<T>(initialState);

  const multiValue = initialState && typeof initialState === "object";

  const canReset = !isEqual(state, defaultValues);

  useEffect(() => {
    const restoredValue = getStorage<T>(key);

    if (restoredValue) {
      if (multiValue) {
        set((prevValue) => ({ ...prevValue, ...restoredValue } as T));
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
          setStorage(
            key,
            newValue,
            options?.daysUntilExpiration,
          );
          return newValue;
        });
      } else {
        setStorage(key, updateState as T, options?.daysUntilExpiration);
        set(updateState as T);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

function getStorage<T>(key: string): T | null {
  try {
    const keyName = `${key}=`;

    const cDecoded = decodeURIComponent(document.cookie);

    const cArr = cDecoded.split("; ");

    let res: string | undefined;

    cArr.forEach((val) => {
      if (val.indexOf(keyName) === 0) res = val.substring(keyName.length);
    });

    if (res) {
      return JSON.parse(res) as T;
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
