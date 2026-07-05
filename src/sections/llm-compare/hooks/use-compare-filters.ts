import { useMemo, useState, useCallback } from "react";

import type { Modality } from "../types";

// ----------------------------------------------------------------------

interface UseCompareFiltersReturn {
  /** Selected vendors; empty means «all». */
  vendors: string[];
  /** Selected modalities that a model must ALL support; empty means «all». */
  modalities: Modality[];
  /** When true, only open-weights models are shown. */
  openOnly: boolean;
  /** True when any filter is active. */
  hasFilter: boolean;
  toggleVendor: (vendor: string) => void;
  toggleModality: (modality: Modality) => void;
  toggleOpenOnly: () => void;
  /** Clears every filter back to «all». */
  reset: () => void;
}

/**
 * Local filter state for the matrix (vendor / modality / open-weights). Kept in
 * component state rather than the URL — filters narrow the view but, unlike
 * sort and pins, aren't the primary thing users share. Empty selections are the
 * neutral «all» state so the matrix is never accidentally empty.
 */
export function useCompareFilters(): UseCompareFiltersReturn {
  const [vendors, setVendors] = useState<string[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [openOnly, setOpenOnly] = useState(false);

  const toggleVendor = useCallback((vendor: string) => {
    setVendors((current) =>
      current.includes(vendor)
        ? current.filter((item) => item !== vendor)
        : [...current, vendor],
    );
  }, []);

  const toggleModality = useCallback((modality: Modality) => {
    setModalities((current) =>
      current.includes(modality)
        ? current.filter((item) => item !== modality)
        : [...current, modality],
    );
  }, []);

  const toggleOpenOnly = useCallback(() => setOpenOnly((on) => !on), []);

  const reset = useCallback(() => {
    setVendors([]);
    setModalities([]);
    setOpenOnly(false);
  }, []);

  const hasFilter = vendors.length > 0 || modalities.length > 0 || openOnly;

  return useMemo(
    () => ({
      vendors,
      modalities,
      openOnly,
      hasFilter,
      toggleVendor,
      toggleModality,
      toggleOpenOnly,
      reset,
    }),
    [
      vendors,
      modalities,
      openOnly,
      hasFilter,
      toggleVendor,
      toggleModality,
      toggleOpenOnly,
      reset,
    ],
  );
}
