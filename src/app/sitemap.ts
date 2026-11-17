import type { MetadataRoute } from "next";

import { paths } from "src/routes/paths";
import { CONFIG } from "src/config-global";
import { LOCALES, DEFAULT_LOCALE } from "src/i18n/locales";
import { getPosts, getReleases } from "src/actions/blog-ssr";
import { SERIES_LESSONS } from "src/sections/home/home-series/data/lessons";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

export const revalidate = 3600;

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

interface RouteSpec {
  path: string;
  lastModified?: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

function contentLastModified(...timestamps: (string | Date | undefined)[]) {
  return timestamps
    .map((timestamp) => (timestamp ? new Date(timestamp) : undefined))
    .find((date) => date && Number.isFinite(date.getTime()));
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
    lastModified: spec.lastModified,
    changeFrequency: spec.changeFrequency,
    priority: spec.priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticSpecs: RouteSpec[] = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
    { path: `${paths.learn.root}/`, changeFrequency: "monthly", priority: 0.8 },
    ...SERIES_LESSONS.map<RouteSpec>((lesson) => ({
      path: `${paths.learn.details(lesson.slug)}/`,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
    { path: "/post/", changeFrequency: "daily", priority: 0.9 },
    { path: "/news/", changeFrequency: "daily", priority: 0.8 },
    { path: "/portfolio/", changeFrequency: "monthly", priority: 0.7 },
    { path: "/changelog/", changeFrequency: "daily", priority: 0.8 },
    { path: "/llm-compare/", changeFrequency: "weekly", priority: 0.8 },
    { path: "/llm-timeline/", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy-policy/", changeFrequency: "yearly", priority: 0.2 },
    {
      path: "/personal-data-consent/",
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const [{ posts }, { releases }] = await Promise.all([
    getPosts(),
    getReleases(),
  ]);

  const postSpecs: RouteSpec[] = posts.flatMap((post) => {
    const id = post._id ?? post.id;
    return id
      ? [
          {
            path: `/post/${id}/`,
            lastModified: contentLastModified(post.updatedAt, post.createdAt),
            changeFrequency: "weekly",
            priority: 0.7,
          },
        ]
      : [];
  });

  const distinctTags = new Set(posts.flatMap((post) => post.tags ?? []));
  const tagSpecs: RouteSpec[] = Array.from(distinctTags, (tag) => ({
    path: `/tag/${encodeURIComponent(tag)}/`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const releasesBySlug = new Map(
    releases.map((release) => [release.slug, release]),
  );
  const releaseSpecs: RouteSpec[] = Array.from(
    releasesBySlug.values(),
    (release) => ({
      path: `/changelog/${encodeURIComponent(release.slug)}/`,
      lastModified: contentLastModified(release.updatedAt, release.releasedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  return [...staticSpecs, ...postSpecs, ...tagSpecs, ...releaseSpecs].flatMap(
    localizedEntries,
  );
}
