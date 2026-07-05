// ----------------------------------------------------------------------
// Types for the /library hub. Three curated, static datasets (no backend):
// a reading-list of external sources, a tool-directory, and own TIL notes.
// «NEVER invented» for facts — an uncertain value is omitted/null, not guessed.

/** Which tab of the hub is active. */
export type LibraryTab = "read" | "tools" | "til";

/** Kind of an external reading source. */
export type ReadingKind =
  | "blog"
  | "newsletter"
  | "paper"
  | "post"
  | "video"
  | "book";

/** An external source worth reading. */
export interface ReadingItem {
  id: string;
  /** Source title, e.g. «Simon Willison's Weblog». */
  title: string;
  /** Author / publisher, e.g. «Simon Willison». */
  author: string;
  kind: ReadingKind;
  /** Canonical external URL. */
  url: string;
  /** Primary language of the source. */
  lang: "ru" | "en";
  /** One-line «зачем читать» (RU). */
  why: string;
}

/** Tool category buckets. */
export type ToolCategory =
  | "agents"
  | "ide"
  | "chat"
  | "search"
  | "images"
  | "audio"
  | "eval"
  | "orchestration"
  | "data";

/** How a tool is priced. */
export type PricingModel = "free" | "freemium" | "paid" | "open-source";

/** An AI tool worth knowing. */
export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  pricing: PricingModel;
  /** Official product URL. */
  url: string;
  /** One-line «для чего» (RU). */
  what: string;
}

/** A short «Today I Learned» micro-note (own content). */
export interface TilItem {
  id: string;
  /** ISO "YYYY-MM-DD". */
  date: string;
  /** The learned thing, short. */
  title: string;
  /** 1–3 sentences: the fact + why it matters (RU). */
  body: string;
  /** Topic tags, e.g. ["prompting", "cost"]. */
  tags: string[];
  /** Where it came from, or null. */
  sourceUrl: string | null;
}
