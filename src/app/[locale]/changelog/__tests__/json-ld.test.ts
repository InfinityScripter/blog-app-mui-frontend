import { it, expect, describe } from "vitest";
import { serializeJsonLd } from "src/utils/serialize-json-ld";

import { buildReleaseListJsonLd } from "../json-ld";

describe("release-list JSON-LD", () => {
  it("cannot close the script through backend-controlled model fields", () => {
    const jsonLd = buildReleaseListJsonLd([
      {
        slug: "hostile-release",
        model: "</script><script>alert(1)</script>",
        version: "1.0</script>",
      },
    ]);
    const serialized = serializeJsonLd(jsonLd);

    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script");
  });

  it("uses official source for catalog-only releases", () => {
    const jsonLd = buildReleaseListJsonLd([
      {
        slug: "gpt-x",
        model: "GPT-X",
        version: "",
        url: "https://example.com/gpt-x",
      },
    ]);

    expect(jsonLd.itemListElement[0].url).toBe("https://example.com/gpt-x");
  });
});
