import { CONFIG } from "src/config-global";
import { getReleases } from "src/actions/blog-ssr";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { ChangelogListView } from "src/sections/changelog/view/changelog-list-view";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

export const metadata = {
  title: "Хроника релизов AI-моделей: версии, цены, контекст",
  description:
    "Лента релизов больших языковых моделей: новые версии, цены за токены, размер контекста и краткий разбор изменений.",
  alternates: { canonical: `${BASE_URL}/changelog/` },
  openGraph: {
    title: "Хроника релизов AI-моделей | Talalaev",
    description:
      "Новые версии LLM: цены, контекст и краткий разбор изменений в одной ленте.",
    url: `${BASE_URL}/changelog/`,
    type: "website",
  },
};

// ISR: serve a cached changelog, refreshed at most every 10 minutes (getReleases
// uses a native fetch with the same revalidate window) so new releases surface
// promptly.
export const revalidate = 600;

export default async function Page() {
  // An unreachable backend at build time must not fail the build: fall back to
  // an empty list and let ISR refill on the next revalidate.
  let releases: Awaited<ReturnType<typeof getReleases>>["releases"] = [];
  try {
    ({ releases } = await getReleases());
  } catch {
    releases = [];
  }

  // ItemList of the release detail pages → richer SERP for the archive.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: releases.map((release, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/changelog/${encodeURIComponent(release.slug)}/`,
      name: `${release.model} ${release.version}`.trim(),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChangelogListView releases={releases} />
    </>
  );
}
