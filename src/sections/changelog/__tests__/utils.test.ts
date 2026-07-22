import type { ModelRelease } from "src/types/api";

import { it, expect, describe } from "vitest";
import {
  vendorColor,
  formatPrice,
  formatContext,
  sortReleasesDesc,
} from "src/sections/changelog/utils";

// ----------------------------------------------------------------------

describe("formatPrice", () => {
  it("renders an em dash for a null (unknown) price — never invented", () => {
    expect(formatPrice(null)).toBe("—");
  });

  it("formats a dollar price and trims trailing zeros", () => {
    expect(formatPrice(3)).toBe("$3");
    expect(formatPrice(2.5)).toBe("$2.5");
    expect(formatPrice(0.15)).toBe("$0.15");
  });
});

describe("formatContext", () => {
  it("renders an em dash for null/zero", () => {
    expect(formatContext(null)).toBe("—");
    expect(formatContext(0)).toBe("—");
  });

  it("compacts thousands and millions", () => {
    expect(formatContext(200000)).toBe("200K");
    expect(formatContext(1000000)).toBe("1M");
    expect(formatContext(128000)).toBe("128K");
  });
});

describe("vendorColor", () => {
  it("maps a known vendor to a theme semantic color (never a hex)", () => {
    expect(vendorColor("OpenAI")).toBe("success");
    expect(vendorColor("anthropic")).toBe("warning");
  });

  it("falls back to default for an unknown vendor", () => {
    expect(vendorColor("Acme AI")).toBe("default");
  });
});

describe("sortReleasesDesc", () => {
  it("sorts newest first with a deterministic name tie-break", () => {
    const makeRelease = (
      id: string,
      model: string,
      releasedAt: string,
    ): ModelRelease => ({
      id,
      model,
      releasedAt,
      slug: id,
      vendor: "Test",
      version: "",
      contextTokens: null,
      priceIn: null,
      priceOut: null,
      changes: [],
      verdict: null,
      sourceUrl: "https://example.com",
      sourceName: null,
      createdAt: releasedAt,
      updatedAt: releasedAt,
    });
    const older = makeRelease("older", "Zeta", "2026-01-01T00:00:00Z");
    const beta = makeRelease("beta", "Beta", "2026-02-01T00:00:00Z");
    const alpha = makeRelease("alpha", "Alpha", "2026-02-01T00:00:00Z");

    expect(sortReleasesDesc([older, beta, alpha]).map(({ id }) => id)).toEqual([
      "alpha",
      "beta",
      "older",
    ]);
  });
});
