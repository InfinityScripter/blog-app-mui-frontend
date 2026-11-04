import type { ModelRelease } from "src/types/api";

import { it, expect, describe } from "vitest";

import { releaseName } from "../llm-catalog-adapters";
import { buildUnifiedLlmCatalog } from "../llm-catalog";

// ----------------------------------------------------------------------

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

describe("release feed duplicates", () => {
  it("merges duplicate feed records of one model and drops empty compare rows", () => {
    let n = 0;
    const feed = (
      vendor: string,
      model: string,
      version: string,
      fields: Partial<ModelRelease>,
    ) => {
      n += 1;
      return release({
        id: `r${n}`,
        slug: `s${n}`,
        vendor,
        model,
        version,
        releasedAt: "2026-10-07T00:00:00.000Z",
        contextTokens: null,
        priceIn: null,
        priceOut: null,
        ...fields,
      });
    };
    const releases = [
      feed("Meta", "Muse Wonder", "2026-10-12", { priceIn: 1, priceOut: 4 }),
      feed("Meta", "Muse", "Wonder", { contextTokens: 1_000_000 }),
      feed("OpenAI", "GPT-6.1 Sol", "2026-09-29", { priceIn: 3 }),
      feed("OpenAI", "GPT", "6.1 Sol", {}),
      feed("Anthropic", "Claude Haiku 5.5", "(2026-10-07)", { priceIn: 1 }),
      feed("Anthropic", "Claude Haiku", "5.5", {}),
      feed("Mistral AI", "Mistral Large", "4", { contextTokens: 256000 }),
      feed("Mistral", "Mistral Large", "4", {}),
      feed("Google", "Gemini 3.7 Flash", "", { priceIn: 0.3 }),
      feed("Google", "Gemini 3.7 Flash", "", { priceIn: 0.3 }),
      feed("Google DeepMind", "EmbeddingGemma", "2", { priceIn: 0.01 }),
      feed("Reflection", "Beam 1.0", "2026-10-16", {}),
    ];
    const catalog = buildUnifiedLlmCatalog([], [], releases);
    const names = catalog.comparableModels.map((model) => model.name).sort();

    expect(names).toEqual([
      "Claude Haiku 5.5",
      "GPT-6.1 Sol",
      "Gemini 3.7 Flash",
      "Mistral Large 4",
      "Muse Wonder",
    ]);
    const muse = catalog.comparableModels.find((m) => m.name === "Muse Wonder");
    expect(muse?.pricing.inputPerM).toBe(1);
    expect(muse?.contextTokens).toBe(1_000_000);
    // Timeline keeps every distinct release, including the empty one.
    expect(catalog.timelineModels.map((m) => m.name)).toContain("Beam 1.0");
    expect(catalog.timelineModels).toHaveLength(7);
  });

  it("appends a split version but not a date or a repeated suffix", () => {
    expect(
      releaseName(release({ model: "Claude Haiku", version: "5.5" })),
    ).toBe("Claude Haiku 5.5");
    expect(
      releaseName(
        release({ model: "Claude Haiku 4.5", version: "(2025-10-15)" }),
      ),
    ).toBe("Claude Haiku 4.5");
    expect(
      releaseName(release({ model: "Claude Sonnet 4.5", version: "4.5" })),
    ).toBe("Claude Sonnet 4.5");
  });
});
