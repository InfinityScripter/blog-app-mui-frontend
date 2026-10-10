import type { Post } from "src/types/domain";

import { it, expect, describe } from "vitest";
import { PUBLISH_STATUS } from "src/types/domain";

import { capFeedTags, rankPostTags } from "../utils";

// ----------------------------------------------------------------------

// Only the fields these helpers read matter (id/tags/publish/createdAt); the
// rest is padded to satisfy the Post shape without pulling in a fixture factory.
function makePost(overrides: Partial<Post>): Post {
  const base: Post = {
    id: "id-1",
    publish: PUBLISH_STATUS.published,
    title: "Заголовок",
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    metaKeywords: [],
    favoritePerson: [],
    comments: [],
    totalViews: 0,
    totalShares: 0,
    totalComments: 0,
    totalFavorites: 0,
    userId: "user-1",
    author: { name: "Автор" },
  };
  return { ...base, ...overrides };
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
