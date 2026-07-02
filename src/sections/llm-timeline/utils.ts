import type { LabelColor } from "src/components/label";

import { YEAR_ERAS } from "./const-ui";

import type { LlmModel, LlmTimelineRow } from "./types";

// ----------------------------------------------------------------------

/**
 * Maps a known vendor (lowercased) to a theme semantic color for its Label —
 * never a hex, so light/dark and primary-color changes stay predictable. An
 * unknown vendor falls back to «default» via {@link vendorColor}.
 */
const VENDOR_TO_COLOR: Record<string, LabelColor> = {
  openai: "success",
  anthropic: "warning",
  google: "info",
  deepmind: "info",
  meta: "info",
  "mistral ai": "secondary",
  mistral: "secondary",
  deepseek: "primary",
  xai: "error",
  cohere: "secondary",
  yandex: "error",
  alibaba: "warning",
  microsoft: "info",
  sber: "success",
  tii: "warning",
  bigscience: "secondary",
  "moonshot ai": "primary",
  "zhipu ai": "info",
};

/** Maps a vendor to a theme semantic color for its Label (never a hex). */
export function vendorColor(vendor: string): LabelColor {
  return VENDOR_TO_COLOR[vendor.trim().toLowerCase()] ?? "default";
}

/**
 * Brand logo icon per vendor (Iconify `logos:` set — carries its own brand
 * colors, so the icon ignores any `color` prop). Vendors without a brand icon
 * in Iconify (e.g. Cohere) fall back to {@link VENDOR_FALLBACK_ICON}, which is
 * monochrome and should be tinted with the vendor's theme color by the caller.
 */
const VENDOR_TO_ICON: Record<string, string> = {
  openai: "logos:openai-icon",
  anthropic: "logos:anthropic-icon",
  google: "logos:google",
  deepmind: "logos:google",
  meta: "logos:meta",
  "mistral ai": "logos:mistral-ai-icon",
  mistral: "logos:mistral-ai-icon",
  deepseek: "logos:deepseek",
  xai: "logos:grok",
  alibaba: "logos:qwen",
  yandex: "logos:yandex-ru",
  microsoft: "logos:microsoft-icon",
  "moonshot ai": "logos:moonshot-ai-icon",
};

/** Generic chip icon for a vendor without a brand logo in Iconify. */
const VENDOR_FALLBACK_ICON = "solar:cpu-bolt-bold-duotone";

/** Resolves a vendor's brand icon, or the generic fallback if none exists. */
export function vendorIcon(vendor: string): string {
  return VENDOR_TO_ICON[vendor.trim().toLowerCase()] ?? VENDOR_FALLBACK_ICON;
}

/** True when the vendor has a real brand logo (colored) vs the tinted fallback. */
export function hasBrandIcon(vendor: string): boolean {
  return Boolean(VENDOR_TO_ICON[vendor.trim().toLowerCase()]);
}

/** Extracts the release year from an ISO date string. */
export function releaseYear(isoDate: string): number {
  return new Date(isoDate).getUTCFullYear();
}

/**
 * Formats a context-window token count into a compact human label
 * (200000 → "200K", 1000000 → "1M"). `null` means unknown → em dash.
 */
export function formatContext(tokens: number | null): string {
  if (tokens === null || Number.isNaN(tokens) || tokens <= 0) return "—";
  if (tokens >= 1_000_000) {
    const millions = tokens / 1_000_000;
    return `${millions.toFixed(millions % 1 === 0 ? 0 : 1)}M`;
  }
  if (tokens >= 1_000) {
    const thousands = tokens / 1_000;
    return `${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)}K`;
  }
  return String(tokens);
}

/** A params value is unknown → em dash, else the disclosed string. */
export function formatParams(params: string | null): string {
  return params && params.trim() ? params : "—";
}

/**
 * Orders models oldest → newest by releaseDate. Pure; returns a new array so
 * callers never mutate the static source.
 */
export function sortByReleaseAsc(models: LlmModel[]): LlmModel[] {
  return [...models].sort(
    (a, b) =>
      new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
  );
}

/**
 * Flattens models into an ascending render list, tagging each with `yearStart`
 * = the year when it is the first model of a new year (else null). Lets the
 * alternating timeline show a year chip at each boundary without breaking the
 * L/R alternation that separate year-label items would cause.
 */
export function withYearMarkers(models: LlmModel[]): LlmTimelineRow[] {
  const ordered = sortByReleaseAsc(models);
  return ordered.map((model, index) => {
    const year = releaseYear(model.releaseDate);
    const prevYear =
      index > 0 ? releaseYear(ordered[index - 1].releaseDate) : null;
    return { model, yearStart: year === prevYear ? null : year };
  });
}

/** DOM id of the first timeline item of a year — target for the year nav. */
export function yearAnchorId(year: number): string {
  return `llm-year-${year}`;
}

/** Era caption for a year chip, or null when the previous era continues. */
export function eraLabel(year: number): string | null {
  return YEAR_ERAS[year] ?? null;
}

/** Ascending list of distinct release years. */
export function timelineYears(models: LlmModel[]): number[] {
  const years = models.map((model) => releaseYear(model.releaseDate));
  return Array.from(new Set(years)).sort((a, b) => a - b);
}

/** A vendor with how many of its models are on the timeline. */
export interface VendorStat {
  vendor: string;
  count: number;
}

/** Vendors with model counts, most-represented first (ties — alphabetical). */
export function vendorStats(models: LlmModel[]): VendorStat[] {
  const counts = models.reduce<Map<string, number>>((acc, model) => {
    acc.set(model.vendor, (acc.get(model.vendor) ?? 0) + 1);
    return acc;
  }, new Map());
  return Array.from(counts, ([vendor, count]) => ({ vendor, count })).sort(
    (a, b) => b.count - a.count || a.vendor.localeCompare(b.vendor),
  );
}

/** Models whose vendor is selected; an empty selection means «all». */
export function filterByVendors(
  models: LlmModel[],
  selected: string[],
): LlmModel[] {
  if (!selected.length) return models;
  return models.filter((model) => selected.includes(model.vendor));
}
