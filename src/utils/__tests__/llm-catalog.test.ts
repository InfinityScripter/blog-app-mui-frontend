import type { ModelRelease } from "src/types/api";
import type { LlmModel } from "src/sections/llm-timeline/types";
import type { ComparableModel } from "src/sections/llm-compare/types";

import { it, expect, describe } from "vitest";

import { releaseName } from "../llm-catalog-adapters";
import { buildUnifiedLlmCatalog } from "../llm-catalog";

// ----------------------------------------------------------------------

function timelineModel(): LlmModel {
  return {
    id: "openai-gpt-x",
    slug: "gpt-x",
    vendor: "OpenAI",
    name: "GPT-X",
    releaseDate: "2026-01-01",
    contextTokens: 128000,
    params: null,
    highlight: "Curated timeline highlight",
    description: "Curated description",
    capabilities: ["reasoning"],
    sourceUrl: "https://old.example.com",
    wikiUrl: null,
    funFact: null,
  };
}

function comparableModel(): ComparableModel {
  return {
    id: "openai-gpt-x",
    vendor: "OpenAI",
    name: "GPT-X",
    releaseDate: "2026-01-01",
    contextTokens: 64000,
    maxOutputTokens: null,
    pricing: { inputPerM: 9, outputPerM: 18 },
    benchmarks: {},
    capabilities: [],
    modality: ["text"],
    openWeights: false,
    highlight: "Stale",
    sourceUrl: "https://stale.example.com",
    pricingAsOf: "2025-12-01",
  };
}

function release(overrides: Partial<ModelRelease>): ModelRelease {
  return {
    id: "release-gpt-x",
    slug: "openai-gpt-x",
    vendor: "OpenAI",
    model: "GPT-X",
    version: "",
    releasedAt: "2026-01-02T00:00:00.000Z",
    contextTokens: 256000,
    priceIn: 2,
    priceOut: 8,
    changes: ["Release feed change"],
    verdict: "Release feed verdict",
    sourceUrl: "https://new.example.com",
    sourceName: "OpenAI",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-07-20T00:00:00.000Z",
    ...overrides,
  };
}

describe("buildUnifiedLlmCatalog", () => {
  it("uses release facts everywhere and adds release-only models", () => {
    const newRelease = release({
      id: "release-claude-y",
      slug: "anthropic-claude-y",
      vendor: "Anthropic",
      model: "Claude Y",
      releasedAt: "2026-07-19T00:00:00.000Z",
      updatedAt: "2026-07-21T00:00:00.000Z",
    });
    const catalog = buildUnifiedLlmCatalog(
      [timelineModel()],
      [comparableModel()],
      [release({}), newRelease],
    );

    expect(catalog.timelineModels).toHaveLength(2);
    expect(catalog.releases).toHaveLength(2);
    expect(catalog.timelineModels[0]).toMatchObject({
      id: "openai-gpt-x",
      releaseDate: "2026-01-02",
      contextTokens: 256000,
      sourceUrl: "https://new.example.com",
    });
    expect(catalog.timelineModels[1]).toMatchObject({
      id: "release-anthropic-claude-y",
      name: "Claude Y",
    });

    expect(catalog.comparableModels).toHaveLength(2);
    expect(catalog.comparableModels[0]).toMatchObject({
      name: "GPT-X",
      releaseDate: "2026-01-02",
      pricing: { inputPerM: 2, outputPerM: 8 },
      highlight: "Curated timeline highlight",
      pricingAsOf: "2025-12-01",
    });
    expect(catalog.comparableModels[1]).toMatchObject({
      id: "release-anthropic-claude-y",
      pricing: { inputPerM: 2, outputPerM: 8 },
      openWeights: null,
    });
    expect(catalog.pricingAsOf).toBe("2026-07-21");
  });

  it("keeps announcement and GA rows distinct when a reused id has different dates", () => {
    const announced: LlmModel = {
      ...timelineModel(),
      id: "openai-o3",
      slug: "o3",
      name: "o3",
      releaseDate: "2024-12-20",
    };
    const ga: ComparableModel = {
      ...comparableModel(),
      id: "openai-o3",
      name: "o3",
      releaseDate: "2025-04-16",
    };
    const gaRelease = release({
      id: "release-o3-o4-mini",
      model: "o3 / o4-mini",
      slug: "o3-o4-mini",
      releasedAt: "2025-04-16T00:00:00.000Z",
    });

    const catalog = buildUnifiedLlmCatalog([announced], [ga], [gaRelease]);

    expect(
      catalog.timelineModels.map(({ releaseDate }) => releaseDate),
    ).toEqual(["2024-12-20", "2025-04-16"]);
    expect(catalog.comparableModels).toHaveLength(1);
    expect(catalog.comparableModels[0]).toMatchObject({
      id: "openai-o3",
      name: "o3",
      releaseDate: "2025-04-16",
    });
  });

  it("does not merge similarly prefixed models", () => {
    const base = timelineModel();
    const pro = release({ model: "GPT-X Pro", slug: "gpt-x-pro" });

    const catalog = buildUnifiedLlmCatalog([base], [], [pro]);

    expect(catalog.timelineModels).toHaveLength(2);
    expect(catalog.timelineModels.map(({ name }) => name)).toEqual([
      "GPT-X",
      "GPT-X Pro",
    ]);
  });

  it("reconstructs model names from legacy family + version feed records", () => {
    expect(
      releaseName(release({ model: "Claude", version: "4.5 Sonnet" })),
    ).toBe("Claude 4.5 Sonnet");
    expect(
      releaseName(release({ model: "Claude 4.5 Sonnet", version: "GA" })),
    ).toBe("Claude 4.5 Sonnet");
  });

  it("drops feed records with a non-HTTP source URL", () => {
    const unsafe = release({
      id: "unsafe",
      slug: "unsafe",
      model: "Unsafe Model",
      sourceUrl: `${"java"}script:alert(1)`,
    });

    const catalog = buildUnifiedLlmCatalog([], [], [unsafe]);

    expect(catalog.releases).toEqual([]);
    expect(catalog.timelineModels).toEqual([]);
    expect(catalog.comparableModels).toEqual([]);
  });

  it("assigns unique compare ids to historical releases sharing a curated id", () => {
    const historical = timelineModel();
    const current = comparableModel();
    const historicalRelease = release({
      id: "historical-release",
      slug: "gpt-x-original",
      releasedAt: "2026-01-01T00:00:00.000Z",
    });
    current.name = "GPT-X-0528";
    current.releaseDate = "2026-07-01";

    const catalog = buildUnifiedLlmCatalog(
      [historical],
      [current],
      [historicalRelease],
    );
    const ids = catalog.comparableModels.map(({ id }) => id);

    expect(ids).toEqual(["openai-gpt-x", "release-gpt-x-original"]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
