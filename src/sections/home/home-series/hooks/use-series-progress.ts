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

  const markPassed = useCallback(
    (lessonNumber: number) =>
      setState({ passed: addPassed(state.passed, lessonNumber) }),
    [setState, state.passed],
  );

  return { passed: state.passed, markPassed };
}
