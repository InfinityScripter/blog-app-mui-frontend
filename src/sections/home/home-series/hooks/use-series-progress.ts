import { useCallback } from "react";
import { useLocalStorage } from "src/hooks/use-local-storage";
import { localStorageGetItem } from "src/utils/storage-available";

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
    (lessonNumber: number) => {
      let latestPassed = passed;

      try {
        const stored: unknown = JSON.parse(
          localStorageGetItem(SERIES_PROGRESS_KEY, "{}"),
        );
        if (
          stored !== null &&
          typeof stored === "object" &&
          "passed" in stored &&
          Array.isArray(stored.passed)
        ) {
          const storedPassed = stored.passed.filter(
            (value: unknown): value is number =>
              typeof value === "number" && Number.isInteger(value) && value > 0,
          );
          latestPassed = Array.from(new Set([...passed, ...storedPassed])).sort(
            (a, b) => a - b,
          );
        }
      } catch (error) {
        console.error("Error while restoring series progress:", error);
      }

      setState({ passed: addPassed(latestPassed, lessonNumber) });
    },
    [setState, passed],
  );

  return { passed, markPassed };
}
