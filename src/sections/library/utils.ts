import type { LabelColor } from "src/components/label";

import {
  PRICING_KEY,
  PRICING_COLOR,
  FALLBACK_COLOR,
  READING_KIND_KEY,
  READING_KIND_ICON,
  TOOL_CATEGORY_KEY,
  READING_KIND_ORDER,
  FALLBACK_LABEL_KEY,
} from "./const";

import type {
  TilItem,
  ToolItem,
  ReadingKind,
  ReadingItem,
  PricingModel,
  ToolCategory,
} from "./types";

// ----------------------------------------------------------------------
// Pure helpers for the library hub. No JSX, no side effects — every function
// returns a new value so callers never mutate the static source. Label helpers
// return an i18n key (relative to the `library` namespace), NOT localized text —
// the component resolves it via `useTranslations("library")`. This keeps these
// helpers locale-agnostic and unit-testable without a translator.

/** A reading kind with its items, in {@link READING_KIND_ORDER}. */
export interface ReadingGroup {
  kind: ReadingKind;
  /** i18n key for the group heading (→ `library.readingKind.<kind>`). */
  labelKey: string;
  items: ReadingItem[];
}

/**
 * Groups reading items by kind in the canonical order, dropping empty groups.
 * Pure; the input array is not mutated.
 */
export function groupByKind(items: ReadingItem[]): ReadingGroup[] {
  return READING_KIND_ORDER.map((kind) => ({
    kind,
    labelKey: readingKindLabelKey(kind),
    items: items.filter((item) => item.kind === kind),
  })).filter((group) => group.items.length > 0);
}

/** Reading items of the selected kinds; empty selection means «all». */
export function filterReadingByKind(
  items: ReadingItem[],
  selected: ReadingKind[],
): ReadingItem[] {
  if (!selected.length) return items;
  return items.filter((item) => selected.includes(item.kind));
}

/** Tool items of the selected categories; empty selection means «all». */
export function filterToolsByCategory(
  items: ToolItem[],
  selected: ToolCategory[],
): ToolItem[] {
  if (!selected.length) return items;
  return items.filter((item) => selected.includes(item.category));
}

/** Distinct reading kinds present, in canonical order. */
export function presentReadingKinds(items: ReadingItem[]): ReadingKind[] {
  const present = new Set(items.map((item) => item.kind));
  return READING_KIND_ORDER.filter((kind) => present.has(kind));
}

/**
 * Distinct tool categories present, sorted by their localized label. The caller
 * passes a `labelOf` resolver (a `t`-backed function) so sorting is locale-aware
 * while this helper stays translation-agnostic.
 */
export function presentToolCategories(
  items: ToolItem[],
  labelOf: (category: ToolCategory) => string,
): ToolCategory[] {
  const present = Array.from(new Set(items.map((item) => item.category)));
  return present.sort((a, b) => labelOf(a).localeCompare(labelOf(b)));
}

/**
 * TIL notes newest-first. Ties (same date) keep their source order — a stable
 * sort — so hand-authored intra-day ordering is preserved. Pure.
 */
export function sortTilDesc(items: TilItem[]): TilItem[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const diff =
        new Date(b.item.date).getTime() - new Date(a.item.date).getTime();
      return diff !== 0 ? diff : a.index - b.index;
    })
    .map((entry) => entry.item);
}

/** i18n key for a reading kind's label, with a safe fallback for unmapped values. */
export function readingKindLabelKey(kind: ReadingKind): string {
  const key = READING_KIND_KEY[kind];
  return key ? `readingKind.${key}` : FALLBACK_LABEL_KEY;
}

/** Icon for a reading kind, with a safe fallback. */
export function readingKindIcon(kind: ReadingKind): string {
  return READING_KIND_ICON[kind] ?? "solar:link-bold-duotone";
}

/** i18n key for a tool category's label, with a safe fallback. */
export function toolCategoryLabelKey(category: ToolCategory): string {
  const key = TOOL_CATEGORY_KEY[category];
  return key ? `toolCategory.${key}` : FALLBACK_LABEL_KEY;
}

/** i18n key for a pricing model's label, with a safe fallback. */
export function pricingLabelKey(pricing: PricingModel): string {
  const key = PRICING_KEY[pricing];
  return key ? `pricing.${key}` : FALLBACK_LABEL_KEY;
}

/** Label color for a pricing model, with a safe fallback. */
export function pricingColor(pricing: PricingModel): LabelColor {
  return PRICING_COLOR[pricing] ?? FALLBACK_COLOR;
}
