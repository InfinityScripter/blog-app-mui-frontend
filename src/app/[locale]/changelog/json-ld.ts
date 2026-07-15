import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

interface ReleaseListItem {
  slug: string;
  model: string;
  version: string;
}

/** Builds archive JSON-LD separately so backend-controlled fields are testable. */
export function buildReleaseListJsonLd(releases: ReleaseListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: releases.map((release, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/changelog/${encodeURIComponent(release.slug)}/`,
      name: `${release.model} ${release.version}`.trim(),
    })),
  };
}
