import { it, expect, describe } from "vitest";
import {
  projectOf,
  dateParts,
  providerOf,
  modelFamily,
} from "src/server/llm-stats/normalize";

describe("modelFamily", () => {
  it("collapses claude ids to family", () => {
    expect(modelFamily("claude-opus-4-8")).toBe("opus");
    expect(modelFamily("anthropic/claude-4.8-opus-20260528")).toBe("opus");
    expect(modelFamily("claude-sonnet-4-6")).toBe("sonnet");
    expect(modelFamily("claude-haiku-4-5-20251001")).toBe("haiku");
  });
  it("maps openai + others", () => {
    expect(modelFamily("gpt-4o")).toBe("gpt-4o");
    expect(modelFamily("o3")).toBe("o3");
    expect(modelFamily("glm-4-7")).toBe("glm");
    expect(modelFamily("<synthetic>")).toBe("synthetic");
  });
  it("falls back to the raw id lowercased for unknown", () => {
    expect(modelFamily("some-new-model")).toBe("some-new-model");
  });
});

describe("providerOf", () => {
  it("infers provider from id", () => {
    expect(providerOf("claude-opus-4-8")).toBe("anthropic");
    expect(providerOf("anthropic/claude-4.8-opus-20260528")).toBe("anthropic");
    expect(providerOf("gpt-4o")).toBe("openai");
    expect(providerOf("glm-4-7")).toBe("zhipu");
  });
});

describe("projectOf", () => {
  it("returns basename of cwd", () => {
    expect(projectOf("/Users/x/projects/blog-app-mui-frontend")).toBe(
      "blog-app-mui-frontend",
    );
    expect(projectOf(null)).toBe(null);
    expect(projectOf("")).toBe(null);
  });
});

describe("dateParts", () => {
  it("splits an ISO ts into local date/weekday/hour", () => {
    const p = dateParts("2026-06-21T15:13:37.550Z");
    expect(p.dateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(p.weekday).toBeGreaterThanOrEqual(0);
    expect(p.weekday).toBeLessThanOrEqual(6);
    expect(p.hour).toBeGreaterThanOrEqual(0);
    expect(p.hour).toBeLessThanOrEqual(23);
  });
});
