import type { Post } from "src/types/domain";

import { CONFIG } from "src/config-global";
import { it, expect, describe } from "vitest";
import { buildRssFeed } from "src/utils/feed-xml";

// Minimal Post-shaped fixture with only the fields buildRssFeed reads.
function post(partial: Partial<Post>): Post {
  return {
    _id: "abc123",
    publish: "published",
    title: "Sample title",
    description: "Sample description",
    tags: [],
    metaKeywords: [],
    totalViews: 0,
    totalShares: 0,
    totalComments: 0,
    totalFavorites: 0,
    favoritePerson: [],
    comments: [],
    userId: "u1",
    author: { name: "Author" },
    createdAt: "2026-06-01T00:00:00.000Z",
    ...partial,
  };
}

const META = {
  feedTitle: "Feed Title",
  feedDescription: "Feed Description",
  feedUrl: `${CONFIG.site.url}/feed.xml`,
};

describe("buildRssFeed", () => {
  it("emits a well-formed RSS 2.0 shell with feed meta", () => {
    const xml = buildRssFeed({ posts: [], ...META });
    expect(xml).toContain('<?xml version="1.0" encoding="utf-8"?>');
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain("<channel>");
    expect(xml).toContain("</channel>");
    expect(xml).toContain("</rss>");
    expect(xml).toContain("<title>Feed Title</title>");
    expect(xml).toContain("<description>Feed Description</description>");
    expect(xml).toContain(`<link>${CONFIG.site.url}/feed.xml</link>`);
  });

  it("escapes XML-significant characters in a post title", () => {
    const xml = buildRssFeed({
      posts: [post({ title: `A & B < C > D " E ' F` })],
      ...META,
    });
    expect(xml).toContain(
      "<title>A &amp; B &lt; C &gt; D &quot; E &apos; F</title>",
    );
    // The raw characters must not leak into the title element.
    expect(xml).not.toContain("<title>A & B < C");
  });

  it("neutralizes a literal ]]> in a description so it can't close the CDATA", () => {
    const xml = buildRssFeed({
      posts: [post({ description: "before ]]> after" })],
      ...META,
    });
    // The split-escape sequence must be present.
    expect(xml).toContain("]]]]><![CDATA[>");
    // And the raw user-supplied "]]>" must not survive intact between the
    // CDATA open and close, which would prematurely terminate the section.
    const cdataOpen = "<![CDATA[before ";
    const start = xml.indexOf(cdataOpen);
    expect(start).toBeGreaterThanOrEqual(0);
    const afterOpen = xml.slice(start + cdataOpen.length);
    // The first thing after "before " is the escape, not a bare "]]>".
    expect(afterOpen.startsWith("]]]]><![CDATA[>")).toBe(true);
  });

  it("builds an absolute item link and guid ending in a trailing slash", () => {
    const xml = buildRssFeed({ posts: [post({ _id: "xyz789" })], ...META });
    const expected = `${CONFIG.site.url}/post/xyz789/`;
    expect(xml).toContain(`<link>${expected}</link>`);
    expect(xml).toContain(`<guid isPermaLink="true">${expected}</guid>`);
    expect(expected.endsWith("/post/xyz789/")).toBe(true);
  });

  it("emits an RFC-822 pubDate parseable by Date with a timezone token", () => {
    const xml = buildRssFeed({
      posts: [post({ createdAt: "2026-06-01T12:34:56.000Z" })],
      ...META,
    });
    const match = xml.match(/<pubDate>([^<]+)<\/pubDate>/);
    expect(match).not.toBeNull();
    const value = match ? match[1] : "";
    expect(value).toContain("GMT");
    expect(Number.isNaN(new Date(value).getTime())).toBe(false);
  });

  it("orders items newest-first by createdAt", () => {
    const xml = buildRssFeed({
      posts: [
        post({ _id: "older", createdAt: "2026-01-01T00:00:00.000Z" }),
        post({ _id: "newer", createdAt: "2026-12-01T00:00:00.000Z" }),
      ],
      ...META,
    });
    const olderPos = xml.indexOf("/post/older/");
    const newerPos = xml.indexOf("/post/newer/");
    expect(newerPos).toBeGreaterThanOrEqual(0);
    expect(olderPos).toBeGreaterThan(newerPos);
  });

  it("caps the output at 40 item blocks", () => {
    const posts = Array.from({ length: 50 }, (_value, index) =>
      post({
        _id: `p${index}`,
        createdAt: new Date(2026, 0, index + 1).toISOString(),
      }),
    );
    const xml = buildRssFeed({ posts, ...META });
    const itemCount = (xml.match(/<item>/g) ?? []).length;
    expect(itemCount).toBe(40);
  });

  it("guards a missing description without throwing and emits empty CDATA", () => {
    const build = () =>
      buildRssFeed({ posts: [post({ description: undefined })], ...META });
    expect(build).not.toThrow();
    expect(build()).toContain("<description><![CDATA[]]></description>");
  });

  it("uses linkFor to emit a /changelog/<slug>/ item link and guid", () => {
    const xml = buildRssFeed({
      posts: [post({ _id: "gpt-5" })],
      ...META,
      linkFor: (p) => `${CONFIG.site.url}/changelog/${p._id ?? p.id ?? ""}/`,
    });
    const expected = `${CONFIG.site.url}/changelog/gpt-5/`;
    expect(xml).toContain(`<link>${expected}</link>`);
    expect(xml).toContain(`<guid isPermaLink="true">${expected}</guid>`);
    // The default /post/ link must NOT appear when linkFor overrides it.
    expect(xml).not.toContain("/post/gpt-5/");
  });

  it("defaults to the /post/<id>/ link when linkFor is omitted", () => {
    const xml = buildRssFeed({ posts: [post({ _id: "keep-post" })], ...META });
    expect(xml).toContain(`<link>${CONFIG.site.url}/post/keep-post/</link>`);
  });
});
