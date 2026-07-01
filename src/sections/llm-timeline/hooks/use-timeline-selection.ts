import { useState, useCallback } from "react";

// ----------------------------------------------------------------------

interface UseTimelineSelectionReturn {
  /** Currently expanded model id, or null when all collapsed. */
  selectedId: string | null;
  /** True when the given id is the expanded one. */
  isSelected: (id: string) => boolean;
  /** Toggles a model: opening one collapses the previously open one. */
  toggle: (id: string) => void;
}

/**
 * Accordion selection for the timeline: at most one model expanded at a time.
 * Clicking the open model collapses it; clicking another switches to it.
 */
export function useTimelineSelection(): UseTimelineSelectionReturn {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isSelected = useCallback(
    (id: string) => id === selectedId,
    [selectedId],
  );

  const toggle = useCallback((id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  return { selectedId, isSelected, toggle };
}
