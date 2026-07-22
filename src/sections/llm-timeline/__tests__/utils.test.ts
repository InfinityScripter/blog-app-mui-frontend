import type { LlmModel } from "src/sections/llm-timeline/types";

import { it, expect, describe } from "vitest";
import {
  hasEra,
  vendorIcon,
  vendorColor,
  releaseYear,
  vendorStats,
  hasBrandIcon,
  formatParams,
  yearAnchorId,
  formatContext,
  timelineYears,
  filterByVendors,
  withYearMarkers,
  sortByReleaseAsc,
  sortByReleaseDesc,
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
    wikiUrl: null,
    funFact: null,
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

describe("vendorIcon / hasBrandIcon", () => {
  it("returns a brand logo for a known vendor", () => {
    expect(vendorIcon("OpenAI")).toBe("logos:openai-icon");
    expect(vendorIcon("Mistral AI")).toBe("logos:mistral-ai-icon");
    expect(hasBrandIcon("OpenAI")).toBe(true);
  });

  it("falls back to a generic icon for a vendor without a brand logo", () => {
    expect(vendorIcon("Cohere")).toBe("solar:cpu-bolt-bold-duotone");
    expect(hasBrandIcon("Cohere")).toBe(false);
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

describe("sortByReleaseDesc", () => {
  it("orders models newest → oldest without mutating the input", () => {
    const input = [
      model("b", "2024-01-01"),
      model("a", "2020-01-01"),
      model("c", "2023-06-01"),
    ];
    const sorted = sortByReleaseDesc(input);
    expect(sorted.map((m) => m.id)).toEqual(["b", "c", "a"]);
    expect(input.map((m) => m.id)).toEqual(["b", "a", "c"]);
  });
});

describe("withYearMarkers", () => {
  it("tags the first model of each year with yearStart, others null", () => {
    const rows = withYearMarkers([
      model("y2024-b", "2024-06-01"),
      model("y2020", "2020-06-01"),
      model("y2024-a", "2024-01-01"),
    ]);
    // newest first: 2024-b, 2024-a, 2020
    expect(rows.map((r) => r.model.id)).toEqual([
      "y2024-b",
      "y2024-a",
      "y2020",
    ]);
    expect(rows.map((r) => r.yearStart)).toEqual([2024, null, 2020]);
  });

  it("returns an empty array for no models", () => {
    expect(withYearMarkers([])).toEqual([]);
  });
});

describe("timelineYears", () => {
  it("returns distinct years newest first", () => {
    const years = timelineYears([
      model("a", "2024-06-01"),
      model("b", "2020-01-01"),
      model("c", "2024-02-01"),
    ]);
    expect(years).toEqual([2024, 2020]);
  });
});

describe("vendorStats", () => {
  it("counts models per vendor, most-represented first", () => {
    const stats = vendorStats([
      model("a", "2024-01-01", "OpenAI"),
      model("b", "2024-02-01", "Meta"),
      model("c", "2024-03-01", "OpenAI"),
    ]);
    expect(stats).toEqual([
      { vendor: "OpenAI", count: 2 },
      { vendor: "Meta", count: 1 },
    ]);
  });

  it("breaks count ties alphabetically", () => {
    const stats = vendorStats([
      model("a", "2024-01-01", "Meta"),
      model("b", "2024-02-01", "Anthropic"),
    ]);
    expect(stats.map((s) => s.vendor)).toEqual(["Anthropic", "Meta"]);
  });
});

describe("filterByVendors", () => {
  const models = [
    model("a", "2024-01-01", "OpenAI"),
    model("b", "2024-02-01", "Meta"),
  ];

  it("returns everything for the empty selection («all»)", () => {
    expect(filterByVendors(models, [])).toEqual(models);
  });

  it("keeps only the selected vendors", () => {
    expect(filterByVendors(models, ["Meta"]).map((m) => m.id)).toEqual(["b"]);
  });
});

describe("yearAnchorId / hasEra", () => {
  it("builds a stable DOM id for a year", () => {
    expect(yearAnchorId(2024)).toBe("llm-year-2024");
  });

  it("flags only era-starting years (caption text is localized in the view)", () => {
    expect(hasEra(2022)).toBe(true);
    expect(hasEra(2019)).toBe(false);
  });
});
