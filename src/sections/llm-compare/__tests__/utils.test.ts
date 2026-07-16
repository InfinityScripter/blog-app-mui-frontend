import { it, expect, describe } from "vitest";

import {
  formatUsd,
  sortModels,
  formatBench,
  metricValue,
  sanitizePins,
  bestInColumn,
  isColumnLeader,
  distinctVendors,
  filterByVendors,
  filterOpenWeights,
  filterByModalities,
} from "../utils";

import type { ComparableModel } from "../types";

// ----------------------------------------------------------------------

function model(over: Partial<ComparableModel>): ComparableModel {
  return {
    id: "x",
    vendor: "OpenAI",
    name: "X",
    releaseDate: "2025-01-01",
    contextTokens: 128000,
    maxOutputTokens: 16000,
    pricing: { inputPerM: 1, outputPerM: 2 },
    benchmarks: {},
    capabilities: [],
    modality: ["text"],
    openWeights: false,
    highlight: "",
    sourceUrl: "https://example.com",
    pricingAsOf: "2026-07-05",
    ...over,
  };
}

describe("formatUsd", () => {
  it("null / negative / NaN → em dash", () => {
    expect(formatUsd(null)).toBe("—");
    expect(formatUsd(-1)).toBe("—");
    expect(formatUsd(Number.NaN)).toBe("—");
  });

  it("zero → Бесплатно", () => {
    expect(formatUsd(0)).toBe("Бесплатно");
  });

  it("sub-$100 keeps 2 decimals, ≥$100 drops them", () => {
    expect(formatUsd(3)).toBe("$3.00");
    expect(formatUsd(0.15)).toBe("$0.15");
    expect(formatUsd(150)).toBe("$150");
  });
});

describe("formatBench", () => {
  it("null / undefined / null-value → em dash", () => {
    expect(formatBench(null)).toBe("—");
    expect(formatBench(undefined)).toBe("—");
    expect(formatBench({ value: null, unit: "percent" })).toBe("—");
  });

  it("percent rounds to 1 decimal, whole numbers have none", () => {
    expect(formatBench({ value: 88.74, unit: "percent" })).toBe("88.7%");
    expect(formatBench({ value: 90, unit: "percent" })).toBe("90%");
  });

  it("elo rounds to integer", () => {
    expect(formatBench({ value: 1387.6, unit: "elo" })).toBe("1388");
  });
});

describe("metricValue", () => {
  it("maps price / context / benchmark keys, null when absent", () => {
    const m = model({
      pricing: { inputPerM: 5, outputPerM: null },
      contextTokens: 200000,
      benchmarks: {
        mmlu: { value: 88, unit: "percent" },
        sweBenchPro: { value: 63.2, unit: "percent" },
      },
    });
    expect(metricValue(m, "priceIn")).toBe(5);
    expect(metricValue(m, "priceOut")).toBeNull();
    expect(metricValue(m, "context")).toBe(200000);
    expect(metricValue(m, "mmlu")).toBe(88);
    expect(metricValue(m, "sweBenchPro")).toBe(63.2);
    expect(metricValue(m, "gpqa")).toBeNull();
    expect(metricValue(m, "sweBench")).toBeNull();
  });
});

describe("sortModels — nulls always last", () => {
  const a = model({ id: "a", pricing: { inputPerM: 3, outputPerM: 3 } });
  const b = model({ id: "b", pricing: { inputPerM: 1, outputPerM: 1 } });
  const c = model({ id: "c", pricing: { inputPerM: null, outputPerM: null } });

  it("asc puts nulls last", () => {
    const ids = sortModels([a, b, c], "priceIn", "asc").map((m) => m.id);
    expect(ids).toEqual(["b", "a", "c"]);
  });

  it("desc puts nulls last too", () => {
    const ids = sortModels([a, b, c], "priceIn", "desc").map((m) => m.id);
    expect(ids).toEqual(["a", "b", "c"]);
  });

  it("does not mutate the input array", () => {
    const input = [a, b, c];
    sortModels(input, "priceIn", "asc");
    expect(input.map((m) => m.id)).toEqual(["a", "b", "c"]);
  });
});

describe("bestInColumn — honours higher/lower-is-better", () => {
  const cheap = model({
    id: "cheap",
    pricing: { inputPerM: 1, outputPerM: 1 },
  });
  const dear = model({ id: "dear", pricing: { inputPerM: 9, outputPerM: 9 } });
  const ctxBig = model({ id: "big", contextTokens: 1000000 });
  const ctxSmall = model({ id: "small", contextTokens: 8000 });

  it("price → lowest wins", () => {
    expect(bestInColumn([cheap, dear], "priceIn")).toBe(1);
  });

  it("context → highest wins", () => {
    expect(bestInColumn([ctxBig, ctxSmall], "context")).toBe(1000000);
  });

  it("all-null column → null", () => {
    const noBench = [model({ benchmarks: {} }), model({ benchmarks: {} })];
    expect(bestInColumn(noBench, "mmlu")).toBeNull();
  });
});

describe("isColumnLeader", () => {
  const cheap = model({
    id: "cheap",
    pricing: { inputPerM: 1, outputPerM: 1 },
  });
  const dear = model({ id: "dear", pricing: { inputPerM: 9, outputPerM: 9 } });

  it("true only for the model matching best; null best never leads", () => {
    const best = bestInColumn([cheap, dear], "priceIn");
    expect(isColumnLeader(cheap, "priceIn", best)).toBe(true);
    expect(isColumnLeader(dear, "priceIn", best)).toBe(false);
    expect(isColumnLeader(cheap, "priceIn", null)).toBe(false);
  });

  it("a null model value never leads even against a real best", () => {
    const noPrice = model({ pricing: { inputPerM: null, outputPerM: null } });
    expect(isColumnLeader(noPrice, "priceIn", 1)).toBe(false);
  });
});

describe("sanitizePins", () => {
  const known = [
    model({ id: "a" }),
    model({ id: "b" }),
    model({ id: "c" }),
    model({ id: "d" }),
  ];

  it("drops unknown ids", () => {
    expect(sanitizePins(["a", "zzz", "b"], known)).toEqual(["a", "b"]);
  });

  it("de-dupes preserving first-seen order", () => {
    expect(sanitizePins(["b", "a", "b", "a"], known)).toEqual(["b", "a"]);
  });

  it("caps at MAX_PINS (3)", () => {
    expect(sanitizePins(["a", "b", "c", "d"], known)).toEqual(["a", "b", "c"]);
  });
});

describe("filters", () => {
  const oa = model({
    id: "oa",
    vendor: "OpenAI",
    modality: ["text", "vision"],
    openWeights: false,
  });
  const ds = model({
    id: "ds",
    vendor: "DeepSeek",
    modality: ["text"],
    openWeights: true,
  });

  it("vendor filter — empty means all", () => {
    expect(filterByVendors([oa, ds], []).map((m) => m.id)).toEqual([
      "oa",
      "ds",
    ]);
    expect(filterByVendors([oa, ds], ["DeepSeek"]).map((m) => m.id)).toEqual([
      "ds",
    ]);
  });

  it("modality filter — requires every selected modality", () => {
    expect(filterByModalities([oa, ds], ["vision"]).map((m) => m.id)).toEqual([
      "oa",
    ]);
    expect(filterByModalities([oa, ds], []).map((m) => m.id)).toEqual([
      "oa",
      "ds",
    ]);
  });

  it("open-weights filter", () => {
    expect(filterOpenWeights([oa, ds], true).map((m) => m.id)).toEqual(["ds"]);
    expect(filterOpenWeights([oa, ds], false).map((m) => m.id)).toEqual([
      "oa",
      "ds",
    ]);
  });

  it("distinctVendors — sorted, unique", () => {
    expect(distinctVendors([ds, oa, ds])).toEqual(["DeepSeek", "OpenAI"]);
  });
});
