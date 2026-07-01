import type { Post } from "src/types/domain";
import type { ModelRelease } from "src/types/api";

import { CONFIG } from "src/config-global";
import { buildRssFeed } from "src/utils/feed-xml";
import { getReleases } from "src/actions/blog-ssr";

// ----------------------------------------------------------------------

// Changelog RSS feed (AI model releases). ISR-cached.
export const revalidate = 3600;

// The RSS builder consumes Post-shaped items; a release carries no title/body of
// its own, so map it: title = «model version», description = verdict or the
// first change, createdAt = releasedAt, and `_id` = slug so `linkFor` can build
// the /changelog/<slug>/ URL from it.
function releaseToFeedPost(release: ModelRelease): Post {
  const title = `${release.model} ${release.version}`.trim();
  const description = release.verdict ?? release.changes[0] ?? "";
  return {
    _id: release.slug,
    publish: "published",
    title: `${release.vendor} · ${title}`,
    description,
    tags: [],
    metaKeywords: [],
    totalViews: 0,
    totalShares: 0,
    totalComments: 0,
    totalFavorites: 0,
    favoritePerson: [],
    comments: [],
    userId: "",
    author: { name: release.vendor },
    createdAt: release.releasedAt,
  };
}

function releaseLink(post: Post): string {
  const slug = post._id ?? post.id ?? "";
  return `${CONFIG.site.url}/changelog/${slug}/`;
}

export async function GET() {
  let releases: Awaited<ReturnType<typeof getReleases>>["releases"] = [];
  try {
    ({ releases } = await getReleases());
  } catch {
    // backend unreachable at build time — emit an empty feed (mirror sitemap.ts)
    releases = [];
  }

  const xml = buildRssFeed({
    posts: releases.map(releaseToFeedPost),
    feedTitle: `${CONFIG.site.name} — Релизы AI-моделей`,
    feedDescription:
      "Хроника релизов больших языковых моделей: версии, цены, контекст",
    feedUrl: `${CONFIG.site.url}/changelog/`,
    linkFor: releaseLink,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
