import { CONFIG } from "src/config-global";
import { getTranslations } from "next-intl/server";
import { getPosts, getPostsByTag } from "src/actions/blog-ssr";
import { localizedAlternates } from "src/utils/seo-alternates";
import { toAppLocale, DEFAULT_LOCALE } from "src/i18n/locales";
// Import directly from the view file (not the barrel) — the barrel re-exports
// the dashboard post editor, which would drag tiptap/dropzone/etc into this
// public bundle.
import { TagListView } from "src/sections/blog/view/tag-list-view";

// ----------------------------------------------------------------------

// On the on-demand/dynamicParams path Next may hand us an already-decoded slug;
// a tag with a literal "%" + non-hex would make decodeURIComponent throw. Degrade
// to the raw value instead of 500-ing.
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// ISR: prerender tag pages and refresh at most once per hour.
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, locale } = await params;
  const decoded = safeDecode(slug);
  const t = await getTranslations({ locale, namespace: "tag.meta" });
  return {
    title: t("title", { tag: decoded }),
    description: t("description", { tag: decoded, site: CONFIG.site.name }),
    // Encode the raw (case-sensitive, possibly Cyrillic) tag; trailing slash
    // matches next.config trailingSlash:true.
    ...localizedAlternates(locale, `/tag/${encodeURIComponent(decoded)}/`),
  };
}

export default async function Page({ params }: PageProps) {
  const { slug, locale } = await params;
  const decoded = safeDecode(slug);

  // Tag-archive titles are localized for a non-original locale from the warmed
  // translation cache (fast DB hit). getPostsByTag falls back to the original
  // (Russian) archive if a cold-cache translation would overrun the serverless
  // budget, so the page never 504s. Chrome is localized; a post's body still
  // translates when opened.
  //
  // No error swallowing: transient backend failures are retried inside
  // getPostsByTag; a total backend outage still THROWS (the fallback fetch fails
  // too) instead of ISR-caching an empty archive for an hour (2026-07-03
  // incident). An unknown tag is a legitimate 200 + empty list, not an error.
  const { posts } = await getPostsByTag(decoded, toAppLocale(locale));

  return <TagListView tag={decoded} posts={posts} />;
}

// ----------------------------------------------------------------------

/**
 * Prerender the distinct tags at build time — but ONLY for the default locale
 * (Russian original). The `en` variants are machine-translated per (post, lang)
 * on the backend; prebuilding them here would double the build-time fetch
 * volume and trip the backend's list rate-limit (429). They render on demand on
 * first request (dynamicParams defaults to true) and are then ISR-cached. Any
 * unknown tag also renders on demand. Wrapped so an unreachable backend at build
 * time yields no params instead of failing.
 */
export async function generateStaticParams(): Promise<
  Array<{ locale: string; slug: string }>
> {
  try {
    const { posts } = await getPosts();
    const tags = posts.flatMap((post) => post.tags ?? []);
    const distinct = Array.from(new Set(tags));
    return distinct.map((tag) => ({
      locale: DEFAULT_LOCALE,
      slug: encodeURIComponent(tag),
    }));
  } catch {
    return [];
  }
}
