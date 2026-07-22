import type { ModelRelease } from "src/types/api";
import type { LlmModel } from "src/sections/llm-timeline/types";
import type { ComparableModel } from "src/sections/llm-compare/types";

import {
  releaseName,
  releaseFromTimeline,
  timelineFromRelease,
  comparableFromRelease,
} from "./llm-catalog-adapters";

// ----------------------------------------------------------------------

export interface UnifiedLlmCatalog {
  releases: ModelRelease[];
  timelineModels: LlmModel[];
  comparableModels: ComparableModel[];
  pricingAsOf: string;
}

function day(value: string): string {
  return value.slice(0, 10);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function normalizeVendor(value: string): string {
  const normalized = normalize(value);
  return normalized === "mistralai" ? "mistral" : normalized;
}

function nameKey(vendor: string, model: string): string {
  return `${normalizeVendor(vendor)}:${normalize(model)}`;
}

function sameVendor(left: string, right: string): boolean {
  return normalizeVendor(left) === normalizeVendor(right);
}

const MODEL_ALIAS_GROUPS: ReadonlyArray<ReadonlyArray<string>> = [
  ["o3", "o3o4mini"],
  ["gemini31pro", "gemini31propreview"],
  ["gemini3", "gemini3pro"],
  ["llama4scoutmaverick", "llama4maverick"],
];

function sameModel(left: string, right: string): boolean {
  const leftNormalized = normalize(left);
  const rightNormalized = normalize(right);
  if (leftNormalized === rightNormalized) return true;
  return MODEL_ALIAS_GROUPS.some(
    (aliases) =>
      aliases.includes(leftNormalized) && aliases.includes(rightNormalized),
  );
}

function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function datesNear(left: string, right: string): boolean {
  return (
    Math.abs(new Date(left).getTime() - new Date(right).getTime()) <= 86_400_000
  );
}

function findRelease(
  model: Pick<LlmModel, "vendor" | "name" | "releaseDate">,
  releases: ModelRelease[],
): ModelRelease | undefined {
  const exact = releases.find(
    (release) =>
      sameVendor(release.vendor, model.vendor) &&
      sameModel(releaseName(release), model.name) &&
      datesNear(release.releasedAt, model.releaseDate),
  );
  if (exact) return exact;

  const sameName = releases.filter(
    (release) =>
      nameKey(release.vendor, releaseName(release)) ===
      nameKey(model.vendor, model.name),
  );
  if (sameName.length === 1) return sameName[0];

  return sameName.find((release) =>
    datesNear(release.releasedAt, model.releaseDate),
  );
}

/** Changelog facts + curated timeline descriptions + compare benchmarks. */
export function buildUnifiedLlmCatalog(
  timelineSource: LlmModel[],
  comparableSource: ComparableModel[],
  releases: ModelRelease[],
): UnifiedLlmCatalog {
  // The release feed is external input. Unsafe schemes must never reach href
  // or JSON-LD sinks in any of the three catalog views.
  const safeReleases = releases.filter((release) =>
    isSafeHttpUrl(release.sourceUrl),
  );
  const matchedTimelineReleaseIds = new Set<string>();
  const timelineModels = timelineSource.map((model) => {
    const release = findRelease(model, safeReleases);
    if (!release) return model;
    matchedTimelineReleaseIds.add(release.id);
    return {
      ...model,
      releaseDate: day(release.releasedAt),
      contextTokens: release.contextTokens ?? model.contextTokens,
      sourceUrl: release.sourceUrl,
    };
  });
  const curatedTimelineModels = [...timelineModels];

  safeReleases.forEach((release) => {
    if (!matchedTimelineReleaseIds.has(release.id)) {
      timelineModels.push(timelineFromRelease(release));
    }
  });

  const matchedComparableReleaseIds = new Set<string>();
  const comparableModels = comparableSource.map((model) => {
    const canonical =
      curatedTimelineModels.find(
        (candidate) =>
          sameVendor(candidate.vendor, model.vendor) &&
          (candidate.id === model.id ||
            sameModel(candidate.name, model.name)) &&
          datesNear(candidate.releaseDate, model.releaseDate),
      ) ?? model;
    // Match the compare row before applying timeline enrichment. The same id
    // can represent an announcement in the timeline and a later GA release in
    // compare data (OpenAI o3 is the concrete case).
    const release =
      findRelease(model, safeReleases) ?? findRelease(canonical, safeReleases);
    if (release) matchedComparableReleaseIds.add(release.id);

    return {
      ...model,
      vendor: canonical.vendor,
      name: canonical.name,
      releaseDate: release ? day(release.releasedAt) : canonical.releaseDate,
      contextTokens: release?.contextTokens ?? canonical.contextTokens,
      pricing: {
        inputPerM: release?.priceIn ?? model.pricing.inputPerM,
        outputPerM: release?.priceOut ?? model.pricing.outputPerM,
      },
      capabilities: canonical.capabilities,
      highlight: canonical.highlight,
      sourceUrl: release?.sourceUrl ?? canonical.sourceUrl,
      // A general release edit is not proof that curated prices were
      // re-verified, so keep their explicit provenance date.
      pricingAsOf: model.pricingAsOf,
    };
  });

  const timelineById = new Map(
    timelineModels.map((model) => [model.id, model]),
  );
  const comparableIds = new Set(comparableModels.map((model) => model.id));
  safeReleases.forEach((release) => {
    if (matchedComparableReleaseIds.has(release.id)) return;
    const timelineModel =
      timelineById.get(`release-${release.slug}`) ??
      timelineModels.find(
        (model) =>
          sameVendor(model.vendor, release.vendor) &&
          sameModel(model.name, releaseName(release)) &&
          datesNear(model.releaseDate, release.releasedAt),
      ) ??
      timelineFromRelease(release);
    const uniqueTimelineModel = comparableIds.has(timelineModel.id)
      ? {
          ...timelineModel,
          id: `release-${release.slug}`,
          slug: release.slug,
        }
      : timelineModel;
    const comparable = comparableFromRelease(release, uniqueTimelineModel);
    comparableIds.add(comparable.id);
    comparableModels.push(comparable);
  });

  const pricingAsOf = comparableModels.reduce(
    (latest, model) =>
      model.pricingAsOf > latest ? model.pricingAsOf : latest,
    "",
  );

  const unifiedReleases = [...safeReleases];
  timelineModels.forEach((model) => {
    if (findRelease(model, safeReleases)) return;
    const comparable = comparableModels.find(
      (candidate) => candidate.id === model.id,
    );
    unifiedReleases.push(releaseFromTimeline(model, comparable));
  });

  return {
    releases: unifiedReleases,
    timelineModels,
    comparableModels,
    pricingAsOf,
  };
}
