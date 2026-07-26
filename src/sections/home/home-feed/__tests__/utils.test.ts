import type { Post } from "src/types/domain";

import { it, expect, describe } from "vitest";
import { PUBLISH_STATUS } from "src/types/domain";

import {
  capFeedTags,
  rankPostTags,
  selectFeedPosts,
  buildFeedFirstPage,
} from "../utils";

// ----------------------------------------------------------------------

// Only the fields these helpers read matter (id/tags/publish/createdAt); the
// rest is padded to satisfy the Post shape without pulling in a fixture factory.
function makePost(overrides: Partial<Post>): Post {
  const base = {
    id: "id-1",
    publish: PUBLISH_STATUS.published,
    title: "Заголовок",
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    metaKeywords: [],
    favoritePerson: [],
    comments: [],
  };
  return { ...base, ...overrides } as Post;
}

describe("rankPostTags", () => {
  it("orders tags by how many published posts carry them", () => {
    const posts = [
      makePost({ id: "1", tags: ["ai", "react"] }),
      makePost({ id: "2", tags: ["ai"] }),
      makePost({ id: "3", tags: ["ai", "react"] }),
      makePost({ id: "4", tags: ["typescript"] }),
    ];

    expect(rankPostTags(posts)).toEqual(["ai", "react", "typescript"]);
  });

  it("de-duplicates case-insensitively, keeping the first-seen casing", () => {
    const posts = [
      makePost({ id: "1", tags: ["React"] }),
      makePost({ id: "2", tags: ["react"] }),
      makePost({ id: "3", tags: ["  REACT  "] }),
    ];

    expect(rankPostTags(posts)).toEqual(["React"]);
  });

  it("drops the 'новости' routing marker and unpublished posts", () => {
    const posts = [
      makePost({ id: "1", tags: ["новости", "ai"] }),
      makePost({
        id: "2",
        tags: ["draft-only"],
        publish: PUBLISH_STATUS.draft,
      }),
    ];

    expect(rankPostTags(posts)).toEqual(["ai"]);
  });

  it("ignores empty/whitespace tags", () => {
    expect(
      rankPostTags([makePost({ id: "1", tags: ["", "   ", "ai"] })]),
    ).toEqual(["ai"]);
  });

  it("breaks count ties alphabetically", () => {
    const posts = [makePost({ id: "1", tags: ["zeta", "alpha"] })];

    expect(rankPostTags(posts)).toEqual(["alpha", "zeta"]);
  });
});

describe("capFeedTags", () => {
  const ranked = ["a", "b", "c", "d", "e"];

  it("trims the list to the limit", () => {
    expect(capFeedTags(ranked, 3, [])).toEqual(["a", "b", "c"]);
  });

  it("keeps a pinned tag that ranked below the cut, in its natural position", () => {
    expect(capFeedTags(ranked, 2, ["e"])).toEqual(["a", "b", "e"]);
  });

  it("matches pinned tags case-insensitively", () => {
    expect(capFeedTags(["Alpha", "Beta", "Gamma"], 1, ["  gamma "])).toEqual([
      "Alpha",
      "Gamma",
    ]);
  });
});

describe("buildFeedFirstPage", () => {
  const posts = [
    makePost({ id: "old", createdAt: "2026-01-01T00:00:00.000Z" }),
    makePost({ id: "new", createdAt: "2026-03-01T00:00:00.000Z" }),
    makePost({ id: "mid", createdAt: "2026-02-01T00:00:00.000Z" }),
  ];

  // Must mirror GET /api/post/list?page=1&limit=N for an anonymous caller:
  // published only, newest-first, with total counting every matching row.
  it("takes the newest posts first and reports the untruncated total", () => {
    expect(buildFeedFirstPage(posts, 2)).toEqual({
      posts: [posts[1], posts[2]],
      total: 3,
      hasMore: true,
    });
  });

  it("reports hasMore false when the page covers everything", () => {
    const page = buildFeedFirstPage(posts, 3);

    expect(page.posts).toHaveLength(3);
    expect(page.hasMore).toBe(false);
  });

  it("counts only published posts, matching the anonymous backend scope", () => {
    const withDraft = [
      ...posts,
      makePost({ id: "draft", publish: PUBLISH_STATUS.draft }),
    ];

    expect(buildFeedFirstPage(withDraft, 10).total).toBe(3);
  });

  it("handles an empty corpus", () => {
    expect(buildFeedFirstPage([], 10)).toEqual({
      posts: [],
      total: 0,
      hasMore: false,
    });
  });
});

describe("selectFeedPosts", () => {
  it("matches any of the selected tags, case-insensitively", () => {
    const posts = [
      makePost({ id: "1", tags: ["AI"] }),
      makePost({ id: "2", tags: ["react"] }),
      makePost({ id: "3", tags: ["go"] }),
    ];

    expect(selectFeedPosts(posts, ["ai", "React"]).map((p) => p.id)).toEqual([
      "1",
      "2",
    ]);
  });
});
