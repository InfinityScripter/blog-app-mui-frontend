import type { ComparableModel, ModelBenchmarks } from "./types";

// ----------------------------------------------------------------------
// Static column / filter config for the comparison matrix. Kept data-only
// (no JSX, no logic) per the sections guideline.

/** Sortable columns. `release` desc is the default order. */
export type SortKey =
  | "release"
  | "priceIn"
  | "priceOut"
  | "context"
  | "mmlu"
  | "gpqa"
  | "sweBench"
  | "aime";

export type SortDir = "asc" | "desc";

/** Keys of {@link ModelBenchmarks} — the benchmark sub-columns. */
export type BenchmarkKey = keyof ModelBenchmarks;

/** For each numeric column, whether a higher raw value is better. */
export const HIGHER_IS_BETTER: Record<SortKey, boolean> = {
  release: true,
  priceIn: false, // cheaper wins
  priceOut: false, // cheaper wins
  context: true,
  mmlu: true,
  gpqa: true,
  sweBench: true,
  aime: true,
};

/** A benchmark column: its data key and its short header label. */
export interface BenchmarkColumn {
  key: BenchmarkKey;
  sortKey: SortKey;
  label: string;
  /** Longer tooltip explaining the benchmark. */
  hint: string;
}

/** Ordered benchmark columns shown in the matrix. */
export const BENCHMARK_COLUMNS: BenchmarkColumn[] = [
  {
    key: "mmlu",
    sortKey: "mmlu",
    label: "MMLU",
    hint: "MMLU — общие знания по 57 предметам, % правильных ответов.",
  },
  {
    key: "gpqa",
    sortKey: "gpqa",
    label: "GPQA",
    hint: "GPQA Diamond — экспертные вопросы уровня аспирантуры, %.",
  },
  {
    key: "sweBench",
    sortKey: "sweBench",
    label: "SWE-bench",
    hint: "SWE-bench Verified — решение реальных GitHub-задач (агентный код), %.",
  },
  {
    key: "aime",
    sortKey: "aime",
    label: "AIME",
    hint: "AIME — олимпиадная математика, % решённых задач.",
  },
];

/** Modality filter options. */
export interface ModalityOption {
  value: ComparableModel["modality"][number];
  label: string;
}

export const MODALITY_OPTIONS: ModalityOption[] = [
  { value: "vision", label: "Vision" },
  { value: "audio", label: "Аудио" },
  { value: "image-gen", label: "Генерация изображений" },
];

/** Default sort applied on first render and on reset. */
export const DEFAULT_SORT_KEY: SortKey = "release";
export const DEFAULT_SORT_DIR: SortDir = "desc";

/** Max models that can be pinned for side-by-side comparison. */
export const MAX_PINS = 3;
