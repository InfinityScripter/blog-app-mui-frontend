import { MAX_PINS, HIGHER_IS_BETTER } from "./const";

import type { SortKey, SortDir } from "./const";
import type { BenchmarkScore, ComparableModel } from "./types";

// ----------------------------------------------------------------------
// Pure helpers for the comparison matrix. No JSX, no side effects — every
// function returns a new value so callers never mutate the static source.

/**
 * Formats a USD-per-1M price. `null` → em dash (prices are never invented).
 * Sub-$100 keeps 2 decimals ("$3.00"), ≥ $100 drops them ("$150").
 */
export function formatUsd(price: number | null): string {
  if (price === null || Number.isNaN(price) || price < 0) return "—";
  if (price === 0) return "Бесплатно";
  const decimals = price >= 100 ? 0 : 2;
  return `$${price.toFixed(decimals)}`;
}

/**
 * Formats a benchmark score. A null value (or null score object) → em dash.
 * Percent → "88.7%"; elo → "1387".
 */
export function formatBench(score: BenchmarkScore | null | undefined): string {
  if (!score || score.value === null || Number.isNaN(score.value)) return "—";
  if (score.unit === "elo") return String(Math.round(score.value));
  const rounded = Math.round(score.value * 10) / 10;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
}

/**
 * The raw numeric a model contributes to a sort/compare column, or `null` when
 * that model has no value for the column. Central mapping used by both sorting
 * and best-in-column so they can never disagree.
 */
export function metricValue(
  model: ComparableModel,
  key: SortKey,
): number | null {
  switch (key) {
    case "release":
      return new Date(model.releaseDate).getTime();
    case "priceIn":
      return model.pricing.inputPerM;
    case "priceOut":
      return model.pricing.outputPerM;
    case "context":
      return model.contextTokens;
    case "mmlu":
      return model.benchmarks.mmlu?.value ?? null;
    case "gpqa":
      return model.benchmarks.gpqa?.value ?? null;
    case "sweBench":
      return model.benchmarks.sweBench?.value ?? null;
    case "sweBenchPro":
      return model.benchmarks.sweBenchPro?.value ?? null;
    case "aime":
      return model.benchmarks.aime?.value ?? null;
    default:
      return null;
  }
}

/**
 * Orders models by `key`/`dir`. Nulls (models missing that metric) always sort
 * last regardless of direction — a missing price must never look "cheapest".
 * Pure; returns a new array.
 */
export function sortModels(
  models: ComparableModel[],
  key: SortKey,
  dir: SortDir,
): ComparableModel[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...models].sort((a, b) => {
    const av = metricValue(a, key);
    const bv = metricValue(b, key);
    if (av === null && bv === null) return 0;
    if (av === null) return 1; // a missing → after b
    if (bv === null) return -1; // b missing → after a
    return (av - bv) * factor || a.name.localeCompare(b.name);
  });
}

/**
 * The best raw value in `models` for column `key`, honouring
 * {@link HIGHER_IS_BETTER} (price is lower-is-better). `null` when no model in
 * the set has a value — used to highlight the winning cell per column.
 */
export function bestInColumn(
  models: ComparableModel[],
  key: SortKey,
): number | null {
  const values = models
    .map((model) => metricValue(model, key))
    .filter((value): value is number => value !== null);
  if (!values.length) return null;
  return HIGHER_IS_BETTER[key] ? Math.max(...values) : Math.min(...values);
}

/**
 * Sanitizes a pin selection from an untrusted source (URL): keeps only ids that
 * exist in `known`, de-dupes preserving first-seen order, and caps at
 * {@link MAX_PINS}. Returns a new array of valid ids.
 */
export function sanitizePins(
  ids: string[],
  known: ComparableModel[],
): string[] {
  const knownIds = new Set(known.map((model) => model.id));
  const deduped = ids.reduce<string[]>((acc, id) => {
    if (knownIds.has(id) && !acc.includes(id)) acc.push(id);
    return acc;
  }, []);
  return deduped.slice(0, MAX_PINS);
}

/** Models whose vendor is in `selected`; empty selection means «all». */
export function filterByVendors(
  models: ComparableModel[],
  selected: string[],
): ComparableModel[] {
  if (!selected.length) return models;
  return models.filter((model) => selected.includes(model.vendor));
}

/** Models supporting every selected modality; empty selection means «all». */
export function filterByModalities(
  models: ComparableModel[],
  selected: string[],
): ComparableModel[] {
  if (!selected.length) return models;
  return models.filter((model) =>
    selected.every((wanted) =>
      model.modality.some((modality) => modality === wanted),
    ),
  );
}

/** Open-weights-only filter when `on`; otherwise the list is unchanged. */
export function filterOpenWeights(
  models: ComparableModel[],
  on: boolean,
): ComparableModel[] {
  return on ? models.filter((model) => model.openWeights) : models;
}

/** Distinct vendors present in the set, alphabetical. */
export function distinctVendors(models: ComparableModel[]): string[] {
  return Array.from(new Set(models.map((model) => model.vendor))).sort((a, b) =>
    a.localeCompare(b),
  );
}

/**
 * True when `model` holds the best value in column `key` (ties all win). `best`
 * is the precomputed {@link bestInColumn} for the shown set. A null model value
 * never leads. Used to tint the winning cell per column.
 */
export function isColumnLeader(
  model: ComparableModel,
  key: SortKey,
  best: number | null | undefined,
): boolean {
  if (best === null || best === undefined) return false;
  const value = metricValue(model, key);
  return value !== null && value === best;
}
