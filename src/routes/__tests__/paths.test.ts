import { paths } from "src/routes/paths";
import { it, expect, describe } from "vitest";

describe("paths.tag.details", () => {
  it("builds a plain ASCII tag path", () => {
    expect(paths.tag.details("agents")).toBe("/tag/agents");
  });

  it("percent-encodes a Cyrillic tag and round-trips via decodeURIComponent", () => {
    const url = paths.tag.details("новости");
    expect(url.startsWith("/tag/%D0")).toBe(true);
    // No raw Cyrillic leaks into the URL.
    expect(url).not.toContain("новости");
    const slug = url.replace("/tag/", "");
    expect(decodeURIComponent(slug)).toBe("новости");
  });

  it("encodes a tag with a space so no raw space survives", () => {
    const url = paths.tag.details("machine learning");
    expect(url).not.toContain(" ");
    expect(url).toContain("machine%20learning");
    expect(decodeURIComponent(url.replace("/tag/", ""))).toBe(
      "machine learning",
    );
  });
});

describe("paths.changelog", () => {
  it("exposes the archive root", () => {
    expect(paths.changelog.root).toBe("/changelog");
  });

  it("builds a plain ASCII release slug path", () => {
    expect(paths.changelog.details("gpt-5")).toBe("/changelog/gpt-5");
  });

  it("encodes a slug with unexpected characters and round-trips", () => {
    const url = paths.changelog.details("gpt 5/mini");
    expect(url).not.toContain(" ");
    // The raw slash must be encoded so it can't split the path segment.
    expect(url).toBe(`/changelog/${encodeURIComponent("gpt 5/mini")}`);
    expect(decodeURIComponent(url.replace("/changelog/", ""))).toBe(
      "gpt 5/mini",
    );
  });
});
