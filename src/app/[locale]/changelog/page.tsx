import { CONFIG } from "src/config-global";
import { getReleases } from "src/actions/blog-ssr";
import { LLM_MODELS } from "src/sections/llm-timeline/const";
import { serializeJsonLd } from "src/utils/serialize-json-ld";
import { buildUnifiedLlmCatalog } from "src/utils/llm-catalog";
import { sortReleasesDesc } from "src/sections/changelog/utils";
import { COMPARABLE_MODELS } from "src/sections/llm-compare/data";
import { getTranslations, setRequestLocale } from "next-intl/server";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { ChangelogListView } from "src/sections/changelog/view/changelog-list-view";

import { buildReleaseListJsonLd } from "./json-ld";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("changelog");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: { canonical: `${BASE_URL}/changelog/` },
    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      url: `${BASE_URL}/changelog/`,
      type: "website",
    },
  };
}

// ISR: serve a cached changelog, refreshed at most every 10 minutes (getReleases
// uses a native fetch with the same revalidate window) so new releases surface
// promptly.
export const revalidate = 600;

export default async function Page() {
  // No error swallowing: transient backend failures are retried inside
  // getReleases; a persistent one must THROW instead of ISR-caching an empty
  // changelog for an hour (2026-07-03 incident).
  const { releases: feedReleases } = await getReleases();
  const catalog = buildUnifiedLlmCatalog(
    LLM_MODELS,
    COMPARABLE_MODELS,
    feedReleases,
  );
  const releases = sortReleasesDesc(catalog.releases);

  // ItemList of the release detail pages → richer SERP for the archive.
  const jsonLd = buildReleaseListJsonLd(
    releases.map((release) => ({
      ...release,
      url: release.id.startsWith("catalog-") ? release.sourceUrl : undefined,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <ChangelogListView releases={releases} />
    </>
  );
}
