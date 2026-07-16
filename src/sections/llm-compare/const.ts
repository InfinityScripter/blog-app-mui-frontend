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
  | "sweBenchPro"
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
  sweBenchPro: true,
  aime: true,
};

/**
 * A benchmark column: its data key, short header label, the exact variant name
 * the matrix compares on, and the benchmark's canonical reference page. Labels
 * and names are proper nouns and stay here as data; the longer description is
 * localized — resolved via `t("benchmarks.<key>.hint")` in the component.
 */
export interface BenchmarkColumn {
  key: BenchmarkKey;
  sortKey: SortKey;
  label: string;
  /** Exact benchmark variant shown in the legend, e.g. "SWE-bench Verified". */
  fullLabel: string;
  /** Canonical page describing the benchmark (paper / official site). */
  infoUrl: string;
}

/** Ordered benchmark columns shown in the matrix. */
export const BENCHMARK_COLUMNS: BenchmarkColumn[] = [
  {
    key: "mmlu",
    sortKey: "mmlu",
    label: "MMLU",
    fullLabel: "MMLU",
    infoUrl: "https://arxiv.org/abs/2009.03300",
  },
  {
    key: "gpqa",
    sortKey: "gpqa",
    label: "GPQA",
    fullLabel: "GPQA Diamond",
    infoUrl: "https://arxiv.org/abs/2311.12022",
  },
  {
    key: "sweBenchPro",
    sortKey: "sweBenchPro",
    label: "SWE Pro",
    fullLabel: "SWE-Bench Pro",
    infoUrl: "https://arxiv.org/abs/2509.16941",
  },
  {
    key: "sweBench",
    sortKey: "sweBench",
    label: "SWE-bench",
    fullLabel: "SWE-bench Verified",
    infoUrl: "https://www.swebench.com/",
  },
  {
    key: "aime",
    sortKey: "aime",
    label: "AIME",
    fullLabel: "AIME",
    infoUrl: "https://maa.org/maa-invitational-competitions/",
  },
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
