// ----------------------------------------------------------------------
// A single LLM in the comparison matrix. Data lives statically in `data/`
// — no backend. Follows the changelog / llm-timeline «NEVER invented» rule:
// any numeric fact not published by the vendor is `null`, never guessed.

/** Text modalities a model accepts or produces. */
export type Modality = "text" | "vision" | "audio" | "image-gen";

/** USD price per 1M tokens. `null` = undisclosed / not applicable. */
export interface ModelPricing {
  /** $ per 1M input tokens; null if undisclosed. */
  inputPerM: number | null;
  /** $ per 1M output tokens; null if undisclosed. */
  outputPerM: number | null;
}

/** A single benchmark score. `value` null = not reported for this model. */
export interface BenchmarkScore {
  /** Raw number — percent (0–100) or elo points. */
  value: number | null;
  /** Disambiguates rendering / comparison semantics. */
  unit: "percent" | "elo";
  /**
   * Direct link to the publication carrying this exact measurement (e.g. a
   * system-card PDF) when it differs from the model's main `sourceUrl`. The
   * value renders as a link so provenance is one click away.
   */
  sourceUrl?: string;
}

/**
 * The curated benchmark columns the matrix compares on. Every field is
 * optional and nullable — an absent or null score renders as an em dash.
 */
export interface ModelBenchmarks {
  /** MMLU — general knowledge, %. */
  mmlu?: BenchmarkScore | null;
  /** GPQA Diamond — graduate-level reasoning, %. */
  gpqa?: BenchmarkScore | null;
  /** SWE-bench Verified — agentic coding, %. */
  sweBench?: BenchmarkScore | null;
  /** SWE-Bench Pro — long-horizon agentic coding (Scale AI), %. */
  sweBenchPro?: BenchmarkScore | null;
  /** AIME — competition math, %. */
  aime?: BenchmarkScore | null;
}

/** One curated, comparable model row. */
export interface ComparableModel {
  /** Stable id; matches the llm-timeline id where the model overlaps. */
  id: string;
  /** Human vendor name, e.g. "OpenAI" (mapped to color/icon by llm-timeline). */
  vendor: string;
  /** Model name, e.g. "GPT-5", "Claude Opus 4.1". */
  name: string;
  /** ISO "YYYY-MM-DD" public release date. */
  releaseDate: string;
  /** Context window in tokens; null if unknown. */
  contextTokens: number | null;
  /** Max output tokens; null if unknown. */
  maxOutputTokens: number | null;
  /** Input/output pricing per 1M tokens. */
  pricing: ModelPricing;
  /** Named benchmark scores (all optional / nullable). */
  benchmarks: ModelBenchmarks;
  /** Short capability tags, e.g. ["reasoning", "agentic"]. */
  capabilities: string[];
  /** Accepted/produced modalities. */
  modality: Modality[];
  /** True when weights are openly released; null when release feed is silent. */
  openWeights: boolean | null;
  /** One-line «why pick this», shown in the row/card. */
  highlight: string;
  /** Vendor pricing/model page — must be verifiable. */
  sourceUrl: string;
  /** ISO date the price/benchmarks were last verified. */
  pricingAsOf: string;
}
