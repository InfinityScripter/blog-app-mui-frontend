import { notFound } from "next/navigation";
import { CONFIG } from "src/config-global";
import { getRelease, getReleases } from "src/actions/blog-ssr";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { ChangelogDetailView } from "src/sections/changelog/view/changelog-detail-view";

import { buildReleaseJsonLd } from "./json-ld";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

// On the on-demand/dynamicParams path Next may hand us an already-decoded slug;
// a slug with a literal "%" + non-hex would make decodeURIComponent throw.
// Degrade to the raw value instead of 500-ing.
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// ISR: prerender release pages and refresh at most every 10 minutes.
export const revalidate = 600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { slug } = await params;
    const decoded = safeDecode(slug);
    const { release } = await getRelease(decoded);
    const title = `${release.model} ${release.version}`.trim();
    const headline = `${release.vendor} · ${title}`;
    const description =
      release.verdict ??
      release.changes[0] ??
      `Релиз ${title} от ${release.vendor} на ${CONFIG.site.name}`;
    const canonical = `${BASE_URL}/changelog/${encodeURIComponent(decoded)}/`;
    return {
      title: headline,
      description,
      alternates: { canonical },
      openGraph: {
        title: headline,
        description,
        url: canonical,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: headline,
        description,
      },
    };
  } catch {
    return { title: "Релиз AI-модели | Talalaev" };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const decoded = safeDecode(slug);

  // A backend hiccup at prerender time must not fail the build — one unreachable
  // release falls back to notFound() and ISR regenerates it on the next request.
  let release: Awaited<ReturnType<typeof getRelease>>["release"];
  try {
    ({ release } = await getRelease(decoded));
  } catch {
    notFound();
  }

  const jsonLd = buildReleaseJsonLd(release);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ChangelogDetailView release={release} />
    </>
  );
}

// ----------------------------------------------------------------------

/**
 * Prerender the known releases at build time; unknown slugs still render on
 * demand (dynamicParams defaults to true) and are cached by ISR. Wrapped so an
 * unreachable backend at build time yields no params instead of failing.
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const { releases } = await getReleases();
    return releases.map((release) => ({ slug: release.slug }));
  } catch {
    return [];
  }
}
