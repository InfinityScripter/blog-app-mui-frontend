import type { ModelRelease } from "src/types/api";

import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;
const PUBLISHER = { "@type": "Person", name: "Михаил Талалаев" } as const;

/**
 * Builds JSON-LD for a release page: a `TechArticle` describing the release
 * with an embedded `SoftwareApplication` (the model itself), plus an optional
 * `Review` carrying the owner's verdict. Returns null when the release is
 * missing so the caller can skip the <script>.
 */
export function buildReleaseJsonLd(release: ModelRelease | undefined) {
  if (!release) return null;

  const title = `${release.model} ${release.version}`.trim();
  const url = `${BASE_URL}/changelog/${encodeURIComponent(release.slug)}/`;

  const application = {
    "@type": "SoftwareApplication",
    name: `${release.vendor} ${title}`,
    applicationCategory: "AIApplication",
    softwareVersion: release.version,
    ...(release.sourceUrl && { url: release.sourceUrl }),
  };

  const base = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${release.vendor} ${title}`,
    datePublished: release.releasedAt,
    dateModified: release.updatedAt ?? release.releasedAt,
    author: PUBLISHER,
    publisher: PUBLISHER,
    mainEntityOfPage: url,
    about: application,
    ...(release.sourceUrl && { isBasedOn: release.sourceUrl }),
    ...(release.sourceName && {
      citation: release.sourceUrl
        ? {
            "@type": "CreativeWork",
            name: release.sourceName,
            url: release.sourceUrl,
          }
        : release.sourceName,
    }),
  };

  if (!release.verdict) return base;

  // The owner's verdict → a Review of the model.
  return {
    ...base,
    review: {
      "@type": "Review",
      reviewBody: release.verdict,
      author: PUBLISHER,
      itemReviewed: application,
    },
  };
}
