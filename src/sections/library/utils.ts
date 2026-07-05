import type { LabelColor } from "src/components/label";

import {
  PRICING_COLOR,
  PRICING_LABEL,
  FALLBACK_LABEL,
  FALLBACK_COLOR,
  READING_KIND_ICON,
  READING_KIND_LABEL,
  READING_KIND_ORDER,
  TOOL_CATEGORY_LABEL,
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
// returns a new value so callers never mutate the static source.

/** A reading kind with its items, in {@link READING_KIND_ORDER}. */
export interface ReadingGroup {
  kind: ReadingKind;
  label: string;
  items: ReadingItem[];
}

/**
 * Groups reading items by kind in the canonical order, dropping empty groups.
 * Pure; the input array is not mutated.
 */
export function groupByKind(items: ReadingItem[]): ReadingGroup[] {
  return READING_KIND_ORDER.map((kind) => ({
    kind,
    label: READING_KIND_LABEL[kind] ?? FALLBACK_LABEL,
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

/** Distinct tool categories present, sorted by their RU label. */
export function presentToolCategories(items: ToolItem[]): ToolCategory[] {
  const present = Array.from(new Set(items.map((item) => item.category)));
  return present.sort((a, b) =>
    toolCategoryLabel(a).localeCompare(toolCategoryLabel(b)),
  );
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

/** RU label for a reading kind, with a safe fallback for unmapped values. */
export function readingKindLabel(kind: ReadingKind): string {
  return READING_KIND_LABEL[kind] ?? FALLBACK_LABEL;
}

/** Icon for a reading kind, with a safe fallback. */
export function readingKindIcon(kind: ReadingKind): string {
  return READING_KIND_ICON[kind] ?? "solar:link-bold-duotone";
}

/** RU label for a tool category, with a safe fallback. */
export function toolCategoryLabel(category: ToolCategory): string {
  return TOOL_CATEGORY_LABEL[category] ?? FALLBACK_LABEL;
}

/** RU label for a pricing model, with a safe fallback. */
export function pricingLabel(pricing: PricingModel): string {
  return PRICING_LABEL[pricing] ?? FALLBACK_LABEL;
}

/** Label color for a pricing model, with a safe fallback. */
export function pricingColor(pricing: PricingModel): LabelColor {
  return PRICING_COLOR[pricing] ?? FALLBACK_COLOR;
}
