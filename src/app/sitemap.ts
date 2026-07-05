import type { MetadataRoute } from "next";

import { CONFIG } from "src/config-global";
import { getPosts, getReleases } from "src/actions/blog-ssr";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

// The app runs with next.config `trailingSlash: true`, so every route's
// canonical URL ends in a slash and the slashless form 308-redirects to it.
// Sitemap entries must point at the final (trailing-slash) URLs, otherwise
// crawlers waste budget on redirect hops and may flag "page redirects".
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/post/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/portfolio/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/changelog/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/llm-compare/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/llm-timeline/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/library/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  let postRoutes: MetadataRoute.Sitemap = [];
  let tagRoutes: MetadataRoute.Sitemap = [];
  let releaseRoutes: MetadataRoute.Sitemap = [];
  try {
    const { posts } = await getPosts();
    postRoutes = posts.map((post) => ({
      url: `${BASE_URL}/post/${post._id ?? post.id}/`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Distinct tags → tag archive pages, exact casing (backend match is
    // case-sensitive), encoded, deduped, trailing slash.
    const distinctTags = Array.from(
      new Set(posts.flatMap((post) => post.tags ?? [])),
    );
    tagRoutes = distinctTags.map((tag) => ({
      url: `${BASE_URL}/tag/${encodeURIComponent(tag)}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  } catch {
    // backend unreachable at build time — skip post/tag entries
  }

  try {
    const { releases } = await getReleases();
    // Dedupe by slug, trailing slash, exact (ascii) slug encoded defensively.
    const distinctSlugs = Array.from(
      new Set(releases.map((release) => release.slug)),
    );
    releaseRoutes = distinctSlugs.map((slug) => ({
      url: `${BASE_URL}/changelog/${encodeURIComponent(slug)}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // backend unreachable at build time — skip release entries
  }

  return [...staticRoutes, ...postRoutes, ...tagRoutes, ...releaseRoutes];
}
