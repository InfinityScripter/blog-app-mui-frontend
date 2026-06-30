import type { MetadataRoute } from "next";

import { CONFIG } from "src/config-global";
import { getPosts } from "src/actions/blog-ssr";

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
  ];

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const { posts } = await getPosts();
    postRoutes = posts.map((post) => ({
      url: `${BASE_URL}/post/${post._id ?? post.id}/`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // backend unreachable at build time — skip post entries
  }

  return [...staticRoutes, ...postRoutes];
}
