import type { Post } from "src/types/domain";
import type { ModelRelease } from "src/types/api";

import { PUBLISH_STATUS } from "src/types/domain";
import { getPosts, getReleases } from "src/actions/blog-ssr";
import { it, vi, expect, describe, beforeEach } from "vitest";

import sitemap from "../sitemap";

vi.mock("src/actions/blog-ssr", () => ({
  getPosts: vi.fn(),
  getReleases: vi.fn(),
}));

const SITE = "https://aifirst.us.com";
const mockPost: Post = {
  _id: "post-id",
  publish: PUBLISH_STATUS.published,
  title: "ИИ",
  tags: ["ИИ"],
  createdAt: "2026-11-01T12:00:00Z",
  metaKeywords: [],
  favoritePerson: [],
  comments: [],
  totalViews: 0,
  totalShares: 0,
  totalComments: 0,
  totalFavorites: 0,
  userId: "author",
  author: { name: "Author" },
};
const mockRelease: ModelRelease = {
  id: "model-id",
  slug: "model",
  vendor: "Vendor",
  model: "Model",
  version: "1",
  releasedAt: "2026-11-01T12:00:00Z",
  createdAt: "2026-11-01T12:00:00Z",
  updatedAt: "2026-11-03T12:00:00Z",
  contextTokens: null,
  priceIn: null,
  priceOut: null,
  changes: [],
  verdict: null,
  sourceUrl: "https://example.com",
  sourceName: null,
};

describe("sitemap", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getPosts).mockResolvedValue({ posts: [] });
    vi.mocked(getReleases).mockResolvedValue({ releases: [], total: 0 });
  });

  it("uses reliable content dates and links the language variants", async () => {
    vi.mocked(getPosts).mockResolvedValue({
      posts: [
        { ...mockPost, updatedAt: "2026-11-02T12:00:00Z" },
        { ...mockPost, _id: undefined, id: "legacy", updatedAt: "unknown" },
        { ...mockPost, _id: undefined },
      ],
    });
    vi.mocked(getReleases).mockResolvedValue({
      releases: [mockRelease],
      total: 1,
    });

    const entries = await sitemap();
    const urls = new Map(entries.map((entry) => [entry.url, entry]));

    expect(urls.get(`${SITE}/ru/`)?.lastModified).toBeUndefined();
    expect(
      urls.get(`${SITE}/ru/tag/${encodeURIComponent("ИИ")}/`),
    ).toBeDefined();
    expect(urls.get(`${SITE}/ru/post/undefined/`)).toBeUndefined();
    expect(urls.get(`${SITE}/ru/post/post-id/`)).toMatchObject({
      lastModified: new Date("2026-11-02T12:00:00Z"),
      alternates: {
        languages: {
          ru: `${SITE}/ru/post/post-id/`,
          en: `${SITE}/en/post/post-id/`,
          "x-default": `${SITE}/ru/post/post-id/`,
        },
      },
    });
    expect(urls.get(`${SITE}/en/post/legacy/`)?.lastModified).toEqual(
      new Date("2026-11-01T12:00:00Z"),
    );
    expect(urls.get(`${SITE}/ru/changelog/model/`)?.lastModified).toEqual(
      new Date("2026-11-03T12:00:00Z"),
    );
  });

  it("publishes the lesson index and detail pages in both languages", async () => {
    const entries = await sitemap();
    const lessonUrls = entries
      .map((entry) => entry.url)
      .filter((url) => url.includes("/learn/"));

    expect(lessonUrls).toHaveLength(26);
    expect(lessonUrls).toContain(`${SITE}/ru/learn/`);
    expect(lessonUrls).toContain(`${SITE}/en/learn/`);
    expect(lessonUrls).toContain(`${SITE}/ru/learn/what-is-a-neural-network/`);
    expect(lessonUrls).toContain(`${SITE}/en/learn/what-is-a-neural-network/`);
  });

  it("fails regeneration when an upstream collection is unavailable", async () => {
    vi.mocked(getPosts).mockRejectedValue(new Error("posts unavailable"));

    await expect(sitemap()).rejects.toThrow("posts unavailable");
  });
});
