import type { ModelRelease } from "src/types/api";
import type { ComparableModel } from "src/sections/llm-compare/types";

// ----------------------------------------------------------------------

function filledFields(release: ModelRelease): number {
  return [release.priceIn, release.priceOut, release.contextTokens].filter(
    (value) => value != null,
  ).length;
}

/** The bot writes one model once per source; merge those copies. */
export function dedupeReleases(
  releases: ModelRelease[],
  sameRelease: (left: ModelRelease, right: ModelRelease) => boolean,
): ModelRelease[] {
  const groups: ModelRelease[][] = [];
  releases.forEach((release) => {
    const group = groups.find((candidates) =>
      sameRelease(candidates[0], release),
    );
    if (group) group.push(release);
    else groups.push([release]);
  });
  return groups.map((group) => {
    const [base, ...rest] = [...group].sort(
      (left, right) => filledFields(right) - filledFields(left),
    );
    return rest.reduce(
      (merged, other) => ({
        ...merged,
        priceIn: merged.priceIn ?? other.priceIn,
        priceOut: merged.priceOut ?? other.priceOut,
        contextTokens: merged.contextTokens ?? other.contextTokens,
        verdict: merged.verdict ?? other.verdict,
        changes: merged.changes.length > 0 ? merged.changes : other.changes,
      }),
      base,
    );
  });
}

export function hasCompareData(model: ComparableModel): boolean {
  if (/embedding/i.test(model.name)) return false;
  return (
    model.pricing.inputPerM != null ||
    model.pricing.outputPerM != null ||
    model.contextTokens != null ||
    Object.keys(model.benchmarks).length > 0
  );
}
