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

/**
 * A benchmark column: its data key and its short header label. The `label` is a
 * proper noun (benchmark name) and stays here as data; the longer tooltip copy
 * is localized — resolved via `t("benchmarks.<key>.hint")` in the component.
 */
export interface BenchmarkColumn {
  key: BenchmarkKey;
  sortKey: SortKey;
  label: string;
}

/** Ordered benchmark columns shown in the matrix. */
export const BENCHMARK_COLUMNS: BenchmarkColumn[] = [
  { key: "mmlu", sortKey: "mmlu", label: "MMLU" },
  { key: "gpqa", sortKey: "gpqa", label: "GPQA" },
  { key: "sweBench", sortKey: "sweBench", label: "SWE-bench" },
  { key: "aime", sortKey: "aime", label: "AIME" },
];

/**
 * Modality filter options. `value` is the stable modality enum; the visible
 * label is localized via `t("modalities.<labelKey>")` in the toolbar, so this
 * stays a plain data list without calling `t()` at module scope.
 */
export interface ModalityOption {
  value: ComparableModel["modality"][number];
  labelKey: "vision" | "audio" | "imageGen";
}

export const MODALITY_OPTIONS: ModalityOption[] = [
  { value: "vision", labelKey: "vision" },
  { value: "audio", labelKey: "audio" },
  { value: "image-gen", labelKey: "imageGen" },
];

/** Default sort applied on first render and on reset. */
export const DEFAULT_SORT_KEY: SortKey = "release";
export const DEFAULT_SORT_DIR: SortDir = "desc";

/** Max models that can be pinned for side-by-side comparison. */
export const MAX_PINS = 3;
