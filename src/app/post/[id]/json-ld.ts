import type { Post } from "src/types/domain";

import { CONFIG } from "src/config-global";
import { NEWS_TAG } from "src/sections/news/const";
import { deriveSource, deriveSourceUrl } from "src/sections/news/utils";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;
const PUBLISHER = { "@type": "Person", name: "Михаил Талалаев" } as const;

/**
 * Builds the JSON-LD for a post page. Posts tagged `новости` are aggregated
 * news, so they emit `NewsArticle` with `isBasedOn`/`citation` pointing at the
 * original source (the site is an AI aggregator — it must attribute, not claim
 * authorship). Authored blog posts emit plain `Article`. Returns null when the
 * post is missing so the caller can skip the <script>.
 */
export function buildPostJsonLd(post: Post | undefined, id: string) {
  if (!post) return null;

  const isNews = (post.tags ?? []).some(
    (tag) => tag.toLowerCase() === NEWS_TAG,
  );

  const base = {
    "@context": "https://schema.org",
    "@type": isNews ? "NewsArticle" : "Article",
    headline: post.title,
    description: post.description,
    image: post.coverUrl ? [post.coverUrl] : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt ?? post.createdAt,
    author: PUBLISHER,
    publisher: PUBLISHER,
    mainEntityOfPage: `${BASE_URL}/post/${id}/`,
  };

  if (!isNews) return base;

  // News: attribute the original source when the bot recorded one.
  const sourceName = deriveSource(post);
  const sourceUrl = deriveSourceUrl(post);
  return {
    ...base,
    ...(sourceUrl && { isBasedOn: sourceUrl, sameAs: sourceUrl }),
    ...(sourceName && {
      citation: sourceUrl
        ? { "@type": "CreativeWork", name: sourceName, url: sourceUrl }
        : sourceName,
    }),
  };
}
