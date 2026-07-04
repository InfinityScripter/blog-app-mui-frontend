import type { Post } from "src/types/domain";

import { it, expect, describe } from "vitest";
import { buildLlmsTxt } from "src/utils/llms-txt";

// ----------------------------------------------------------------------

const SITE = {
  siteName: "aifirst.us.com",
  siteUrl: "https://aifirst.us.com",
  tagline: "Блог про AI.",
};

function post(overrides: Partial<Post>): Post {
  // Only the fields buildLlmsTxt reads matter; the rest is padded to satisfy
  // the Post shape without pulling in a fixture factory.
  const base = {
    _id: "id-1",
    title: "Заголовок",
    description: "Описание",
    tags: [],
    favoritePerson: [],
    comments: [],
  };
  return { ...base, ...overrides } as Post;
}

describe("buildLlmsTxt", () => {
  it("emits the site header and tagline", () => {
    const out = buildLlmsTxt({ ...SITE, posts: [] });
    expect(out).toContain("# aifirst.us.com");
    expect(out).toContain("> Блог про AI.");
  });

  it("renders each post as a markdown link with its description", () => {
    const out = buildLlmsTxt({
      ...SITE,
      posts: [post({ _id: "abc", title: "Пост", description: "Про LLM" })],
    });
    expect(out).toContain(
      "- [Пост](https://aifirst.us.com/post/abc/): Про LLM",
    );
  });

  it("omits the colon/description when there is no description", () => {
    const out = buildLlmsTxt({
      ...SITE,
      posts: [post({ _id: "abc", title: "Пост", description: "" })],
    });
    expect(out).toContain("- [Пост](https://aifirst.us.com/post/abc/)\n");
    expect(out).not.toContain("/post/abc/):");
  });

  it("falls back to `id` when `_id` is absent", () => {
    const out = buildLlmsTxt({
      ...SITE,
      posts: [post({ _id: undefined, id: "legacy", title: "Пост" })],
    });
    expect(out).toContain("(https://aifirst.us.com/post/legacy/)");
  });

  it("drops posts that have no id at all", () => {
    const out = buildLlmsTxt({
      ...SITE,
      posts: [post({ _id: undefined, id: undefined, title: "Без id" })],
    });
    expect(out).not.toContain("Без id");
  });

  it("collapses whitespace in descriptions to a single line", () => {
    const out = buildLlmsTxt({
      ...SITE,
      posts: [
        post({ _id: "x", title: "П", description: "one\n\ntwo   three" }),
      ],
    });
    expect(out).toContain("one two three");
  });

  it("shows a placeholder line when there are no posts", () => {
    const out = buildLlmsTxt({ ...SITE, posts: [] });
    expect(out).toContain("## Посты");
    expect(out).toContain("Список временно недоступен.");
  });
});
