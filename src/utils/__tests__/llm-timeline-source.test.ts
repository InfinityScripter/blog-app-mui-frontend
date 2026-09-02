import type { LlmModel } from "src/sections/llm-timeline/types";

import { it, expect, describe } from "vitest";

import { mergeTimelineModels } from "../llm-timeline-source";

function model(overrides: Partial<LlmModel>): LlmModel {
  return {
    id: "anthropic-claude-fable-5-1",
    slug: "claude-fable-5-1",
    vendor: "Anthropic",
    name: "Claude Fable 5.1",
    releaseDate: "2026-09-01",
    contextTokens: 1000000,
    params: null,
    highlight: "Чтение из кеша подешевело вчетверо.",
    description: "Обновление старшей модели Anthropic.",
    capabilities: ["agentic"],
    sourceUrl: "https://www.anthropic.com/claude-fable-and-mythos-5-1",
    wikiUrl: null,
    funFact: null,
    ...overrides,
  };
}

describe("mergeTimelineModels", () => {
  it("appends remote entries after the curated ones", () => {
    const curated = [model({ id: "openai-gpt-x", slug: "gpt-x" })];
    const remote = [model({})];
    const merged = mergeTimelineModels(curated, remote);
    expect(merged.map((item) => item.id)).toEqual([
      "openai-gpt-x",
      "anthropic-claude-fable-5-1",
    ]);
  });

  it("keeps the curated entry when a remote one has the same id", () => {
    const curated = [model({ highlight: "Рукописный заголовок" })];
    const remote = [model({ highlight: "Заголовок от джобы" })];
    const merged = mergeTimelineModels(curated, remote);
    expect(merged).toHaveLength(1);
    expect(merged[0].highlight).toBe("Рукописный заголовок");
  });

  it("drops a remote entry whose sourceUrl is not http(s)", () => {
    const remote = [model({ sourceUrl: `${"java"}script:alert(1)` })];
    expect(mergeTimelineModels([], remote)).toEqual([]);
  });

  it("nulls an unsafe wikiUrl instead of dropping the entry", () => {
    const remote = [model({ wikiUrl: `${"java"}script:alert(1)` })];
    const merged = mergeTimelineModels([], remote);
    expect(merged).toHaveLength(1);
    expect(merged[0].wikiUrl).toBeNull();
  });
});
