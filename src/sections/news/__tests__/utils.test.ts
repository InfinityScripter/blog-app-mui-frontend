import type { Post } from "src/types/domain";

import { it, expect, describe } from "vitest";
import { PUBLISH_STATUS } from "src/types/domain";

import { sortNewestFirst } from "../utils";

// ----------------------------------------------------------------------

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

describe("sortNewestFirst", () => {
  it("puts the newest post first when the backend sends them oldest-first", () => {
    const posts = [
      makePost({ id: "june", createdAt: "2026-06-21T07:42:49.278Z" }),
      makePost({ id: "oct-9", createdAt: "2026-10-09T06:02:13.193Z" }),
      makePost({ id: "oct-10", createdAt: new Date("2026-10-10T06:02:32Z") }),
    ];

    expect(sortNewestFirst(posts).map((post) => post.id)).toEqual([
      "oct-10",
      "oct-9",
      "june",
    ]);
  });

  it("does not reorder the array it was given", () => {
    const posts = [
      makePost({ id: "old", createdAt: "2026-01-01T00:00:00.000Z" }),
      makePost({ id: "new", createdAt: "2026-02-01T00:00:00.000Z" }),
    ];

    sortNewestFirst(posts);

    expect(posts.map((post) => post.id)).toEqual(["old", "new"]);
  });
});
