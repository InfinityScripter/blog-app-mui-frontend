import { it, expect, describe } from "vitest";

import { withImageWidth } from "../utils";

describe("withImageWidth", () => {
  it.each([
    [
      "https://images.unsplash.com/photo-1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1?auto=format&fit=crop&w=800&q=80",
    ],
    [
      "https://images.unsplash.com/photo-1?auto=format&q=80",
      "https://images.unsplash.com/photo-1?auto=format&q=80&w=800",
    ],
    ["https://example.com/a.jpg?w=1200", "https://example.com/a.jpg?w=1200"],
    ["/assets/images/cover/cover-2.webp", "/assets/images/cover/cover-2.webp"],
  ])("%s", (src, expected) => {
    expect(withImageWidth(src, 800)).toBe(expected);
  });
});
