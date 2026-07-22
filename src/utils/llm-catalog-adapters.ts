import type { ModelRelease } from "src/types/api";
import type { LlmModel } from "src/sections/llm-timeline/types";
import type { Modality, ComparableModel } from "src/sections/llm-compare/types";

// ----------------------------------------------------------------------

function day(value: string): string {
  return value.slice(0, 10);
}

export function releaseName(release: ModelRelease): string {
  const model = release.model.trim();
  const version = release.version.trim();

  // Older bot records stored the family in `model` and the actual model name
  // in `version` (for example Claude + 4.5 Sonnet). Current records already
  // carry the full name in `model`, so only expand that unambiguous legacy
  // shape and never append date-like release labels.
  const isBareFamily = !/\s|\d/.test(model);
  const isDateLikeVersion = /^\d{4}[-./]\d{1,2}/.test(version);
  if (version && isBareFamily && !isDateLikeVersion) {
    return `${model} ${version}`;
  }

  return model;
}

export function timelineFromRelease(release: ModelRelease): LlmModel {
  const name = releaseName(release);
  return {
    id: `release-${release.slug}`,
    slug: release.slug,
    vendor: release.vendor,
    name,
    releaseDate: day(release.releasedAt),
    contextTokens: release.contextTokens,
    params: null,
    highlight:
      release.verdict ??
      release.changes[0] ??
      `${release.vendor} ${releaseName(release)}`,
    description: [release.verdict, ...release.changes]
      .filter(Boolean)
      .join(" "),
    capabilities: [],
    sourceUrl: release.sourceUrl,
    wikiUrl: null,
    funFact: null,
  };
}

function modalities(capabilities: string[]): Modality[] {
  const known = new Set(capabilities.map((item) => item.toLowerCase()));
  const result: Modality[] = ["text"];
  if (known.has("vision") || known.has("multimodal")) result.push("vision");
  if (known.has("audio")) result.push("audio");
  if (known.has("image-gen")) result.push("image-gen");
  return result;
}

export function comparableFromRelease(
  release: ModelRelease,
  timelineModel: LlmModel,
): ComparableModel {
  return {
    id: timelineModel.id,
    vendor: timelineModel.vendor,
    name: timelineModel.name,
    releaseDate: timelineModel.releaseDate,
    contextTokens: timelineModel.contextTokens,
    maxOutputTokens: null,
    pricing: {
      inputPerM: release.priceIn,
      outputPerM: release.priceOut,
    },
    benchmarks: {},
    capabilities: timelineModel.capabilities,
    modality: modalities(timelineModel.capabilities),
    openWeights: timelineModel.capabilities.includes("open-weights")
      ? true
      : null,
    highlight: timelineModel.highlight,
    sourceUrl: timelineModel.sourceUrl,
    pricingAsOf: day(release.updatedAt || release.releasedAt),
  };
}

export function releaseFromTimeline(
  model: LlmModel,
  comparable: ComparableModel | undefined,
): ModelRelease {
  const timestamp = `${day(model.releaseDate)}T00:00:00.000Z`;
  return {
    id: `catalog-${model.id}`,
    slug: model.slug,
    vendor: model.vendor,
    model: model.name,
    version: "",
    releasedAt: timestamp,
    contextTokens: model.contextTokens,
    priceIn: comparable?.pricing.inputPerM ?? null,
    priceOut: comparable?.pricing.outputPerM ?? null,
    changes: model.description ? [model.description] : [],
    verdict: model.highlight,
    sourceUrl: model.sourceUrl,
    sourceName: model.vendor,
    createdAt: timestamp,
    updatedAt: comparable?.pricingAsOf
      ? `${comparable.pricingAsOf}T00:00:00.000Z`
      : timestamp,
  };
}
