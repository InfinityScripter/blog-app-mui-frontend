import { MODELS_RU } from "./models-ru";
import { MODELS_OPEN } from "./models-open";
import { MODELS_FRONTIER } from "./models-frontier";

import type { ComparableModel } from "../types";

// ----------------------------------------------------------------------
// The full curated comparison set. Kept in one flat array; the view sorts and
// filters it. Order here is irrelevant — the default view sort is release desc.

export const COMPARABLE_MODELS: ComparableModel[] = [
  ...MODELS_FRONTIER,
  ...MODELS_OPEN,
  ...MODELS_RU,
];

/** The single «prices verified as of» date shown on the page (all rows share it). */
export const PRICING_AS_OF = "2026-07-05";
