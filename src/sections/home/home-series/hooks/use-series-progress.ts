import { useCallback } from "react";
import { useLocalStorage } from "src/hooks/use-local-storage";

import { addPassed } from "../utils";
import { SERIES_PROGRESS_KEY, SERIES_PROGRESS_INITIAL } from "../const";

import type { SeriesProgress } from "../types";

// ----------------------------------------------------------------------

export function useSeriesProgress() {
  const { state, setState } = useLocalStorage<SeriesProgress>(
    SERIES_PROGRESS_KEY,
    SERIES_PROGRESS_INITIAL,
  );

  const passed = Array.isArray(state.passed)
    ? state.passed
    : SERIES_PROGRESS_INITIAL.passed;

  const markPassed = useCallback(
    (lessonNumber: number) =>
      setState({ passed: addPassed(passed, lessonNumber) }),
    [setState, passed],
  );

  return { passed, markPassed };
}
