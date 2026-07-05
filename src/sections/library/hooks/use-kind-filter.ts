import { useMemo, useState, useCallback } from "react";

// ----------------------------------------------------------------------

interface UseKindFilterReturn<T extends string> {
  /** Selected values; empty means «all». */
  selected: T[];
  /** True when at least one value is selected. */
  hasFilter: boolean;
  /** True when the given value is selected. */
  isActive: (value: T) => boolean;
  /** Adds/removes a value from the selection. */
  toggle: (value: T) => void;
  /** Resets to «all». */
  clear: () => void;
}

/**
 * A generic multi-select filter over a string-enum, kept in local state (the
 * filter narrows a view but isn't the primary shared thing — unlike the tab).
 * Reused by the reading kind-filter and the tools category-filter. Empty
 * selection is the neutral «all» state so a section is never accidentally empty.
 */
export function useKindFilter<T extends string>(): UseKindFilterReturn<T> {
  const [selected, setSelected] = useState<T[]>([]);

  const toggle = useCallback((value: T) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const isActive = useCallback(
    (value: T) => selected.includes(value),
    [selected],
  );

  return useMemo(
    () => ({
      selected,
      hasFilter: selected.length > 0,
      isActive,
      toggle,
      clear,
    }),
    [selected, isActive, toggle, clear],
  );
}
