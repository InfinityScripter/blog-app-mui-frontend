import { CONFIG } from "src/config-global";
import { getTranslations } from "next-intl/server";
import { getNewsPosts } from "src/actions/blog-ssr";
import { localizedAlternates } from "src/utils/seo-alternates";
import { toAppLocale, DEFAULT_LOCALE } from "src/i18n/locales";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { NewsListView } from "src/sections/news/view/news-list-view";

// ----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news.meta" });
  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, "/news/"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `${CONFIG.site.url}/${locale}/news/`,
      type: "website",
    },
  };
}

// ISR: serve a cached news feed, refreshed at most hourly (getNewsPosts uses a
// native fetch with the same revalidate window).
export const revalidate = 3600;

/**
 * Prerender ONLY the default-locale (Russian) news feed at build. The EN feed is
 * intentionally left to on-demand ISR (dynamicParams defaults true): rendering
 * it at build would bake whatever the translation cache holds AT BUILD TIME into
 * a static page — and a cold cache during a deploy would freeze the ORIGINAL
 * (Russian) titles into /en/news until the next deploy. On-demand, the first
 * request renders against the (warmed) cache and is then ISR-cached. This
 * mirrors the post/[id] and tag/[slug] RU-only prebuild.
 */
export function generateStaticParams() {
  return [{ locale: DEFAULT_LOCALE }];
}

interface PageComponentProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageComponentProps) {
  const { locale } = await params;
  // Feed titles/descriptions are localized for a non-original locale from the
  // warmed translation cache (fast DB hit). getNewsPosts falls back to the
  // original (Russian) feed if a cold-cache translation would overrun the
  // serverless budget, so the page never 504s. Chrome is localized via
  // next-intl; a post's BODY still translates when opened (/post/[id]).
  //
  // No error swallowing: transient backend failures are retried inside
  // getNewsPosts; a total backend outage still THROWS (the fallback fetch fails
  // too) rather than caching an empty feed for the ISR window.
  const { posts } = await getNewsPosts(toAppLocale(locale));

  return <NewsListView posts={posts} />;
}
