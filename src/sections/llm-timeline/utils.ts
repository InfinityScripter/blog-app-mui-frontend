import type { LabelColor } from "src/components/label";

import type { LlmModel, LlmYearGroup } from "./types";

// ----------------------------------------------------------------------

/**
 * Maps a known vendor (lowercased) to a theme semantic color for its Label —
 * never a hex, so light/dark and primary-color changes stay predictable. An
 * unknown vendor falls back to «default» via {@link vendorColor}.
 */
export const VENDOR_TO_COLOR: Record<string, LabelColor> = {
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
};

/** Maps a vendor to a theme semantic color for its Label (never a hex). */
export function vendorColor(vendor: string): LabelColor {
  return VENDOR_TO_COLOR[vendor.trim().toLowerCase()] ?? "default";
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
 * Groups models by release year, years ascending and models within each year
 * ascending. Drives the year-labelled vertical timeline.
 */
export function groupByYear(models: LlmModel[]): LlmYearGroup[] {
  const ordered = sortByReleaseAsc(models);
  const byYear: Record<number, LlmModel[]> = {};

  ordered.forEach((model) => {
    const year = releaseYear(model.releaseDate);
    const bucket = byYear[year];
    if (bucket) {
      bucket.push(model);
    } else {
      byYear[year] = [model];
    }
  });

  return Object.keys(byYear)
    .map(Number)
    .sort((a, b) => a - b)
    .map((year) => ({ year, models: byYear[year] }));
}
