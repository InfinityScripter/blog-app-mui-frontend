import { LLM_MODELS_2023 } from "./data/models-2023";
import { LLM_MODELS_2024 } from "./data/models-2024";
import { LLM_MODELS_2025 } from "./data/models-2025";
import { LLM_MODELS_2018_2022 } from "./data/models-2018-2022";

import type { LlmModel } from "./types";

// ----------------------------------------------------------------------

/**
 * Curated history of landmark large language models. Data is static (no
 * backend), split per era in `data/`. Following the changelog «NEVER
 * invented» rule: unknown numeric facts are `null`, undisclosed params are
 * `null`. Each entry carries a verified announcement URL (+ Wikipedia when
 * an article exists). Ordering is not significant — the view sorts by
 * `releaseDate`.
 */
export const LLM_MODELS: LlmModel[] = [
  ...LLM_MODELS_2018_2022,
  ...LLM_MODELS_2023,
  ...LLM_MODELS_2024,
  ...LLM_MODELS_2025,
];
