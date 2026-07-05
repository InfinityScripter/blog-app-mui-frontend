import { CONFIG } from "src/config-global";
import { getTranslations } from "next-intl/server";
import { getBlogPosts } from "src/actions/blog-ssr";
import { localizedAlternates } from "src/utils/seo-alternates";
import { toAppLocale, DEFAULT_LOCALE } from "src/i18n/locales";
// Import directly from the view file (not the barrel) — the barrel re-exports
// the dashboard post editor, which would drag tiptap/dropzone/etc into this
// public bundle.
import { PostListHomeView } from "src/sections/blog/view/post-list-home-view";

// ----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.meta" });
  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, "/post/"),
    openGraph: {
      title: t("ogTitle"),
      description: t("description"),
      url: `${CONFIG.site.url}/${locale}/post/`,
      type: "website",
    },
  };
}

// ISR: serve a cached blog list, refreshed at most hourly (getPosts uses a
// native fetch with the same revalidate window).
export const revalidate = 3600;

/**
 * Prerender ONLY the default-locale (Russian) blog list at build; the EN list
 * renders on-demand (dynamicParams defaults true). Building the EN variant would
 * bake whatever the translation cache holds at build time — a cold cache would
 * freeze the ORIGINAL titles into /en/post until the next deploy. On-demand, the
 * first request renders against the warmed cache and is ISR-cached thereafter.
 * Mirrors post/[id] and tag/[slug].
 */
export function generateStaticParams() {
  return [{ locale: DEFAULT_LOCALE }];
}

interface PageComponentProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageComponentProps) {
  const { locale } = await params;
  // List titles/descriptions are localized for a non-original locale from the
  // warmed translation cache (fast DB hit). getBlogPosts falls back to the
  // original (Russian) list if a cold-cache translation would overrun the
  // serverless budget, so the page never 504s. Chrome is localized via
  // next-intl; a post's BODY still translates when opened (/post/[id]).
  //
  // No error swallowing: transient backend failures are retried inside
  // getBlogPosts; a total backend outage still THROWS (the fallback fetch fails
  // too) rather than caching an empty list for the ISR window.
  const { posts } = await getBlogPosts(toAppLocale(locale));

  return <PostListHomeView posts={posts} />;
}
