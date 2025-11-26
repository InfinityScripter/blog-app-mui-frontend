import { useMemo, useState, useCallback } from "react";

import { isEqual } from "src/utils/helper";

// ----------------------------------------------------------------------

interface UseSetStateReturn<T> {
  state: T;
  setState: (updateState: Partial<T>) => void;
  setField: <K extends keyof T>(name: K, updateValue: T[K]) => void;
  onResetState: () => void;
  canReset: boolean;
}

export function useSetState<T extends Record<string, unknown>>(initialState: T): UseSetStateReturn<T> {
  const [state, set] = useState<T>(initialState);

  const canReset = !isEqual(state, initialState);

  const setState = useCallback((updateState: Partial<T>) => {
    set((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const setField = useCallback(
    <K extends keyof T>(name: K, updateValue: T[K]) => {
      setState({
        [name]: updateValue,
      } as Partial<T>);
    },
    [setState],
  );

  const onResetState = useCallback(() => {
    set(initialState);
  }, [initialState]);

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
      setField,
      onResetState,
      canReset,
    }),
    [canReset, onResetState, setField, setState, state],
  );

  return memoizedValue;
}
