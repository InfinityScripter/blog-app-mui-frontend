import type { LabelColor } from "src/components/label";

import type {
  TilItem,
  ToolItem,
  LibraryTab,
  ReadingKind,
  ReadingItem,
  PricingModel,
  ToolCategory,
} from "./types";

// ----------------------------------------------------------------------
// Static config for the library hub: tab defs and key/color/icon maps. Data-only
// (no JSX, no logic) per the sections guideline. User-visible labels are NOT
// stored here — a data module can't call the `t()` hook at module scope, so each
// entry carries a stable i18n key (→ `library.<group>.<key>`) resolved per-locale
// in the components/hooks via `useTranslations("library")`.

/** A hub tab: its value (also the `?tab=` slug) and icon; label via `tabs.<value>`. */
export interface TabDef {
  value: LibraryTab;
  icon: string;
}

export const TABS: TabDef[] = [
  { value: "read", icon: "solar:book-2-bold-duotone" },
  { value: "tools", icon: "solar:widget-5-bold-duotone" },
  { value: "til", icon: "solar:lightbulb-bold-duotone" },
];

export const DEFAULT_TAB: LibraryTab = "read";

/** i18n key suffix for each reading kind (→ `library.readingKind.<key>`). */
export const READING_KIND_KEY: Record<ReadingKind, string> = {
  blog: "blog",
  newsletter: "newsletter",
  paper: "paper",
  post: "post",
  video: "video",
  book: "book",
};

/** Order reading kinds appear in the grouped list. */
export const READING_KIND_ORDER: ReadingKind[] = [
  "blog",
  "newsletter",
  "post",
  "paper",
  "video",
  "book",
];

/** i18n key suffix for each tool category (→ `library.toolCategory.<key>`). */
export const TOOL_CATEGORY_KEY: Record<ToolCategory, string> = {
  agents: "agents",
  ide: "ide",
  chat: "chat",
  search: "search",
  images: "images",
  audio: "audio",
  eval: "eval",
  orchestration: "orchestration",
  data: "data",
};

/** i18n key suffix for each pricing model (→ `library.pricing.<key>`). */
export const PRICING_KEY: Record<PricingModel, string> = {
  free: "free",
  freemium: "freemium",
  paid: "paid",
  "open-source": "open-source",
};

export const PRICING_COLOR: Record<PricingModel, LabelColor> = {
  free: "success",
  freemium: "warning",
  paid: "default",
  "open-source": "info",
};

/** Icon per reading kind (chip). */
export const READING_KIND_ICON: Record<ReadingKind, string> = {
  blog: "solar:notebook-bold-duotone",
  newsletter: "solar:letter-bold-duotone",
  paper: "solar:document-text-bold-duotone",
  post: "solar:pen-new-square-bold-duotone",
  video: "solar:videocamera-bold-duotone",
  book: "solar:book-bookmark-bold-duotone",
};

/** i18n key for the label shown when an enum value has no mapping (→ `library.fallbackLabel`). */
export const FALLBACK_LABEL_KEY = "fallbackLabel";
export const FALLBACK_COLOR: LabelColor = "default";

// Re-export the item types so consumers can import config + types from one place.
export type { TilItem, ToolItem, LibraryTab, ReadingItem };
