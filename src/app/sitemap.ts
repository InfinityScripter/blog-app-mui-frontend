import type { MetadataRoute } from "next";

import { CONFIG } from "src/config-global";
import { LOCALES, DEFAULT_LOCALE } from "src/i18n/locales";
import { getPosts, getReleases } from "src/actions/blog-ssr";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

interface RouteSpec {
  path: string;
  lastModified?: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

// Expand one locale-less route into one sitemap entry per locale. Each entry
// carries `alternates.languages` (hreflang) linking every locale variant, with
// `x-default` → the original (Russian). The app runs with `trailingSlash: true`
// and `localePrefix: "always"`, so every URL is `/<locale><path>` ending in a
// slash — crawlers get the final URLs, not redirect hops.
function localizedEntries(spec: RouteSpec): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  LOCALES.forEach((code) => {
    languages[code] = `${BASE_URL}/${code}${spec.path}`;
  });
  languages["x-default"] = `${BASE_URL}/${DEFAULT_LOCALE}${spec.path}`;

  return LOCALES.map((code) => ({
    url: `${BASE_URL}/${code}${spec.path}`,
    lastModified: spec.lastModified ?? new Date(),
    changeFrequency: spec.changeFrequency,
    priority: spec.priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticSpecs: RouteSpec[] = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
    { path: "/post/", changeFrequency: "daily", priority: 0.9 },
    { path: "/news/", changeFrequency: "daily", priority: 0.8 },
    { path: "/portfolio/", changeFrequency: "monthly", priority: 0.7 },
    { path: "/changelog/", changeFrequency: "daily", priority: 0.8 },
    { path: "/llm-compare/", changeFrequency: "weekly", priority: 0.8 },
    { path: "/llm-timeline/", changeFrequency: "monthly", priority: 0.7 },
    { path: "/llm-stats/", changeFrequency: "weekly", priority: 0.8 },
    { path: "/library/", changeFrequency: "weekly", priority: 0.7 },
  ];

  const postSpecs: RouteSpec[] = [];
  const tagSpecs: RouteSpec[] = [];
  const releaseSpecs: RouteSpec[] = [];

  try {
    const { posts } = await getPosts();
    posts.forEach((post) => {
      postSpecs.push({
        path: `/post/${post._id ?? post.id}/`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });

    // Distinct tags → tag archive pages, exact casing (backend match is
    // case-sensitive), encoded, deduped, trailing slash.
    const distinctTags = Array.from(
      new Set(posts.flatMap((post) => post.tags ?? [])),
    );
    distinctTags.forEach((tag) => {
      tagSpecs.push({
        path: `/tag/${encodeURIComponent(tag)}/`,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    });
  } catch {
    // backend unreachable at build time — skip post/tag entries
  }

  try {
    const { releases } = await getReleases();
    const distinctSlugs = Array.from(
      new Set(releases.map((release) => release.slug)),
    );
    distinctSlugs.forEach((slug) => {
      releaseSpecs.push({
        path: `/changelog/${encodeURIComponent(slug)}/`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  } catch {
    // backend unreachable at build time — skip release entries
  }

  return [...staticSpecs, ...postSpecs, ...tagSpecs, ...releaseSpecs].flatMap(
    localizedEntries,
  );
}
