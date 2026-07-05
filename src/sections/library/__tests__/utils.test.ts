import { it, expect, describe } from "vitest";

import {
  groupByKind,
  sortTilDesc,
  pricingColor,
  pricingLabel,
  readingKindIcon,
  readingKindLabel,
  toolCategoryLabel,
  presentReadingKinds,
  filterReadingByKind,
  presentToolCategories,
  filterToolsByCategory,
} from "../utils";

import type { TilItem, ToolItem, ReadingItem } from "../types";

// ----------------------------------------------------------------------

function reading(over: Partial<ReadingItem>): ReadingItem {
  return {
    id: "r",
    title: "T",
    author: "A",
    kind: "blog",
    url: "https://example.com",
    lang: "en",
    why: "",
    ...over,
  };
}

function tool(over: Partial<ToolItem>): ToolItem {
  return {
    id: "t",
    name: "N",
    category: "agents",
    pricing: "free",
    url: "https://example.com",
    what: "",
    ...over,
  };
}

function til(over: Partial<TilItem>): TilItem {
  return {
    id: "x",
    date: "2026-01-01",
    title: "T",
    body: "B",
    tags: [],
    sourceUrl: null,
    ...over,
  };
}

describe("groupByKind", () => {
  it("groups in canonical order and drops empty groups", () => {
    const items = [
      reading({ id: "a", kind: "paper" }),
      reading({ id: "b", kind: "blog" }),
      reading({ id: "c", kind: "blog" }),
    ];
    const groups = groupByKind(items);
    // blog before paper per READING_KIND_ORDER; no empty kinds present.
    expect(groups.map((g) => g.kind)).toEqual(["blog", "paper"]);
    expect(groups[0].items.map((i) => i.id)).toEqual(["b", "c"]);
    expect(groups[0].label).toBe("Блоги");
  });

  it("returns empty array for no items", () => {
    expect(groupByKind([])).toEqual([]);
  });
});

describe("filterReadingByKind", () => {
  const items = [
    reading({ id: "a", kind: "blog" }),
    reading({ id: "b", kind: "paper" }),
  ];

  it("empty selection means all", () => {
    expect(filterReadingByKind(items, []).map((i) => i.id)).toEqual(["a", "b"]);
  });

  it("filters to the selected kinds", () => {
    expect(filterReadingByKind(items, ["paper"]).map((i) => i.id)).toEqual([
      "b",
    ]);
  });
});

describe("filterToolsByCategory", () => {
  const items = [
    tool({ id: "a", category: "agents" }),
    tool({ id: "b", category: "ide" }),
  ];

  it("empty selection means all", () => {
    expect(filterToolsByCategory(items, []).map((i) => i.id)).toEqual([
      "a",
      "b",
    ]);
  });

  it("filters to the selected categories", () => {
    expect(filterToolsByCategory(items, ["ide"]).map((i) => i.id)).toEqual([
      "b",
    ]);
  });
});

describe("present* helpers", () => {
  it("presentReadingKinds → canonical order, unique", () => {
    const items = [
      reading({ kind: "paper" }),
      reading({ kind: "blog" }),
      reading({ kind: "paper" }),
    ];
    expect(presentReadingKinds(items)).toEqual(["blog", "paper"]);
  });

  it("presentToolCategories → unique, sorted by RU label", () => {
    const items = [
      tool({ category: "ide" }),
      tool({ category: "agents" }),
      tool({ category: "ide" }),
    ];
    // localeCompare orders Latin «IDE и кодинг» before Cyrillic «Агенты».
    expect(presentToolCategories(items)).toEqual(["ide", "agents"]);
  });
});

describe("sortTilDesc", () => {
  it("newest first, stable within same date", () => {
    const items = [
      til({ id: "old", date: "2026-01-01" }),
      til({ id: "new", date: "2026-03-01" }),
      til({ id: "same1", date: "2026-02-01" }),
      til({ id: "same2", date: "2026-02-01" }),
    ];
    expect(sortTilDesc(items).map((i) => i.id)).toEqual([
      "new",
      "same1",
      "same2",
      "old",
    ]);
  });

  it("does not mutate the input", () => {
    const input = [
      til({ id: "a", date: "2026-01-01" }),
      til({ id: "b", date: "2026-02-01" }),
    ];
    sortTilDesc(input);
    expect(input.map((i) => i.id)).toEqual(["a", "b"]);
  });
});

describe("label / color fallbacks", () => {
  it("known values map correctly", () => {
    expect(readingKindLabel("blog")).toBe("Блоги");
    expect(toolCategoryLabel("agents")).toBe("Агенты");
    expect(pricingLabel("free")).toBe("Бесплатно");
    expect(pricingColor("open-source")).toBe("info");
    expect(readingKindIcon("blog")).toContain("solar:");
  });
});
