// ----------------------------------------------------------------------
// A single curated LLM in the history timeline. Data lives statically in
// `const.ts` — no backend. Follows the changelog «NEVER invented» rule:
// unknown numeric facts are `null`, unknown params are `null`.

export interface LlmModel {
  /** Stable id, e.g. "openai-gpt-3". */
  id: string;
  /** Kebab slug, e.g. "gpt-3" — reserved for future anchor links. */
  slug: string;
  /** Human vendor name, e.g. "OpenAI" (lowercased when mapped to a color). */
  vendor: string;
  /** Model name, e.g. "GPT-4", "Claude 3.5 Sonnet". */
  name: string;
  /** ISO "YYYY-MM-DD" public release/announcement date. */
  releaseDate: string;
  /** Context window in tokens; null if unknown / not applicable. */
  contextTokens: number | null;
  /** Disclosed parameter count, e.g. "175B", "8x7B MoE"; null if undisclosed. */
  params: string | null;
  /** One-line «why it matters», shown on the timeline card. */
  highlight: string;
  /** 2-4 sentences shown in the expanded detail panel. */
  description: string;
  /** Short capability tags, e.g. ["multimodal", "reasoning"]. */
  capabilities: string[];
  /** Official announcement / paper URL — must point at the model's own page. */
  sourceUrl: string;
  /** Wikipedia article about the model/family (ru preferred), or null. */
  wikiUrl: string | null;
  /** One verified curious fact shown in the detail panel, or null. */
  funFact: string | null;
}

/** A model in render order, tagged with the year when it opens a new year. */
export interface LlmTimelineRow {
  model: LlmModel;
  /** The year to label above this row, or null if same year as the previous. */
  yearStart: number | null;
}

/** One floating logo slot in the decorative 3D backdrop (see `const-ui.ts`). */
export interface BackdropSlot {
  /** CSS offset from the top, e.g. "12%". */
  top: string;
  /** CSS offset from the left, e.g. "6%". */
  left: string;
  /** Icon size in px. */
  size: number;
  /** Full float+spin cycle duration, seconds. */
  duration: number;
  /** Animation start offset, seconds. */
  delay: number;
}
