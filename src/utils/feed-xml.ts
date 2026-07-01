import type { Post } from "src/types/domain";

import { CONFIG } from "src/config-global";

import { coverSrc } from "./cover-src";

// ----------------------------------------------------------------------

// Pure RSS 2.0 builder shared by /feed.xml and /news/feed.xml. No side effects,
// functional array code only (no for-of / while) per the repo es5 lint rules.

const MAX_ITEMS = 40;

interface BuildRssFeedParams {
  posts: Post[];
  feedTitle: string;
  feedDescription: string;
  feedUrl: string;
}

/** Escapes the five XML-significant characters for safe attribute/text output. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date?: string | Date): string {
  const parsed = date ? new Date(date) : new Date();
  const time = parsed.getTime();
  return (Number.isNaN(time) ? new Date() : parsed).toUTCString();
}

function postLink(post: Post): string {
  const id = post._id ?? post.id ?? "";
  return `${CONFIG.site.url}/post/${id}/`;
}

function buildItem(post: Post): string {
  const link = postLink(post);
  const title = escapeXml(post.title ?? "");
  // Neutralize a literal "]]>" so it can't close the CDATA section early and
  // produce malformed XML (standard CDATA-split escape).
  const safeDesc = (post.description ?? "").replace(/]]>/g, "]]]]><![CDATA[>");
  const pubDate = toRfc822(post.createdAt);

  const cover = coverSrc(post.coverUrl, String(post._id ?? post.id ?? post.title));
  const enclosure = cover
    ? `<enclosure url="${escapeXml(cover)}" type="image/webp" />`
    : "";

  return [
    "    <item>",
    `      <title>${title}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `      <pubDate>${pubDate}</pubDate>`,
    `      <description><![CDATA[${safeDesc}]]></description>`,
    enclosure ? `      ${enclosure}` : "",
    "    </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildRssFeed({
  posts,
  feedTitle,
  feedDescription,
  feedUrl,
}: BuildRssFeedParams): string {
  const items = [...posts]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, MAX_ITEMS)
    .map(buildItem)
    .join("\n");

  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escapeXml(feedTitle)}</title>`,
    `    <link>${escapeXml(feedUrl)}</link>`,
    `    <description>${escapeXml(feedDescription)}</description>`,
    "    <language>ru</language>",
    `    <lastBuildDate>${toRfc822()}</lastBuildDate>`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");
}
