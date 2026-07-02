import { useState, useCallback } from "react";

// ----------------------------------------------------------------------

interface UseVendorFilterReturn {
  /** Currently selected vendors; empty means «show all». */
  selected: string[];
  /** True when at least one vendor is selected. */
  hasFilter: boolean;
  /** True when the given vendor is selected. */
  isActive: (vendor: string) => boolean;
  /** Adds/removes a vendor from the selection. */
  toggleVendor: (vendor: string) => void;
  /** Resets to «show all». */
  clear: () => void;
}

/**
 * Multi-select vendor filter for the timeline. The empty selection is the
 * neutral state («all vendors») so the timeline is never accidentally empty.
 */
export function useVendorFilter(): UseVendorFilterReturn {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleVendor = useCallback((vendor: string) => {
    setSelected((current) =>
      current.includes(vendor)
        ? current.filter((item) => item !== vendor)
        : [...current, vendor],
    );
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const isActive = useCallback(
    (vendor: string) => selected.includes(vendor),
    [selected],
  );

  return {
    selected,
    hasFilter: selected.length > 0,
    isActive,
    toggleVendor,
    clear,
  };
}
