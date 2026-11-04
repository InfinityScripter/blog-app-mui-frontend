import type { MapPoint, LevelState, SeriesProgress } from "./types";

// ----------------------------------------------------------------------

export const SERIES_PROGRESS_KEY = "life-style-series-progress";

export const SERIES_PROGRESS_INITIAL: SeriesProgress = { passed: [] };

// Anchor the hero "start" button scrolls to. Duplicated as a literal in
// home-hero (sections are isolated), keep both in sync.
export const SERIES_SECTION_ID = "series";

export const QUIZ_SIZE = 5;

export const RELATED_POSTS_COUNT = 2;

// Newest posts scanned for a lesson's tags; one shared SWR key for all levels.
export const RELATED_POSTS_POOL = 50;

export const LEVEL_STATE_LABEL_KEY: Record<
  LevelState,
  "legendPassed" | "legendCurrent" | "legendOpen" | "legendSoon"
> = {
  passed: "legendPassed",
  current: "legendCurrent",
  open: "legendOpen",
  soon: "legendSoon",
};

export const VARYA_BARKS = ["woof", "next", "go"] as const;

export const MAP_CITY_SRC = "/assets/life-style/night-city.png";

export const MAP_POINTS: MapPoint[] = Array.from(
  { length: 12 },
  (_, index) => ({
    left: 6 + index * (88 / 11),
    top: index % 2 === 0 ? 70 : 46,
  }),
);
