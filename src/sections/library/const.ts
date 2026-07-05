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
// Static config for the library hub: tab defs and label/color maps. Data-only
// (no JSX, no logic) per the sections guideline.

/** A hub tab: its key, RU label, and icon. */
export interface TabDef {
  value: LibraryTab;
  label: string;
  icon: string;
}

export const TABS: TabDef[] = [
  { value: "read", label: "Читать", icon: "solar:book-2-bold-duotone" },
  { value: "tools", label: "Инструменты", icon: "solar:widget-5-bold-duotone" },
  { value: "til", label: "TIL", icon: "solar:lightbulb-bold-duotone" },
];

export const DEFAULT_TAB: LibraryTab = "read";

/** RU labels for reading kinds (plural — used as group headings). */
export const READING_KIND_LABEL: Record<ReadingKind, string> = {
  blog: "Блоги",
  newsletter: "Рассылки",
  paper: "Статьи и препринты",
  post: "Знаковые посты",
  video: "Видео и подкасты",
  book: "Книги",
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

/** RU labels for tool categories. */
export const TOOL_CATEGORY_LABEL: Record<ToolCategory, string> = {
  agents: "Агенты",
  ide: "IDE и кодинг",
  chat: "Чат-ассистенты",
  search: "Поиск и research",
  images: "Изображения",
  audio: "Аудио и речь",
  eval: "Оценка и тесты",
  orchestration: "Оркестрация",
  data: "Данные и RAG",
};

/** RU labels + Label color for pricing models. */
export const PRICING_LABEL: Record<PricingModel, string> = {
  free: "Бесплатно",
  freemium: "Freemium",
  paid: "Платно",
  "open-source": "Open-source",
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

/** Fallbacks for any unmapped enum value (defensive rendering). */
export const FALLBACK_LABEL = "Прочее";
export const FALLBACK_COLOR: LabelColor = "default";

// Re-export the item types so consumers can import config + types from one place.
export type { TilItem, ToolItem, LibraryTab, ReadingItem };
