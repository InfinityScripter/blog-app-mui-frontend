import type { LlmModel } from "src/sections/llm-timeline/types";

import { it, expect, describe } from "vitest";
import {
  groupByYear,
  vendorColor,
  releaseYear,
  formatParams,
  formatContext,
  sortByReleaseAsc,
} from "src/sections/llm-timeline/utils";

// ----------------------------------------------------------------------

function model(id: string, releaseDate: string, vendor = "OpenAI"): LlmModel {
  return {
    id,
    slug: id,
    vendor,
    name: id,
    releaseDate,
    contextTokens: null,
    params: null,
    highlight: "",
    description: "",
    capabilities: [],
    sourceUrl: "https://example.com",
  };
}

describe("vendorColor", () => {
  it("maps a known vendor to a theme color", () => {
    expect(vendorColor("OpenAI")).toBe("success");
    expect(vendorColor("anthropic")).toBe("warning");
  });

  it("falls back to «default» for an unknown vendor", () => {
    expect(vendorColor("Unknown Corp")).toBe("default");
  });
});

describe("formatContext", () => {
  it("renders an em dash for null (unknown) — never invented", () => {
    expect(formatContext(null)).toBe("—");
    expect(formatContext(0)).toBe("—");
  });

  it("formats thousands and millions compactly", () => {
    expect(formatContext(2048)).toBe("2.0K");
    expect(formatContext(8000)).toBe("8K");
    expect(formatContext(200000)).toBe("200K");
    expect(formatContext(1_000_000)).toBe("1M");
    expect(formatContext(128000)).toBe("128K");
  });
});

describe("formatParams", () => {
  it("renders an em dash for undisclosed params", () => {
    expect(formatParams(null)).toBe("—");
    expect(formatParams("  ")).toBe("—");
  });

  it("passes through a disclosed value", () => {
    expect(formatParams("175B")).toBe("175B");
  });
});

describe("releaseYear", () => {
  it("extracts the UTC year from an ISO date", () => {
    expect(releaseYear("2020-06-11")).toBe(2020);
  });
});

describe("sortByReleaseAsc", () => {
  it("orders models oldest → newest without mutating the input", () => {
    const input = [
      model("b", "2024-01-01"),
      model("a", "2020-01-01"),
      model("c", "2023-06-01"),
    ];
    const sorted = sortByReleaseAsc(input);
    expect(sorted.map((m) => m.id)).toEqual(["a", "c", "b"]);
    // original untouched
    expect(input.map((m) => m.id)).toEqual(["b", "a", "c"]);
  });
});

describe("groupByYear", () => {
  it("buckets by year ascending, models within ascending", () => {
    const groups = groupByYear([
      model("y2024-b", "2024-06-01"),
      model("y2020", "2020-06-01"),
      model("y2024-a", "2024-01-01"),
    ]);
    expect(groups.map((g) => g.year)).toEqual([2020, 2024]);
    expect(groups[1].models.map((m) => m.id)).toEqual(["y2024-a", "y2024-b"]);
  });

  it("returns an empty array for no models", () => {
    expect(groupByYear([])).toEqual([]);
  });
});
