import { CONFIG } from "src/config-global";
import { toAppLocale } from "src/i18n/locales";
import { getTranslations } from "next-intl/server";
import { getNewsPosts } from "src/actions/blog-ssr";
import { localizedAlternates } from "src/utils/seo-alternates";
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

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  // No error swallowing: transient backend failures are retried inside
  // getNewsPosts; a persistent one must THROW — a failed build keeps the
  // previous deployment live, a failed ISR regeneration keeps the stale page.
  // Swallowing into `posts = []` cached an EMPTY news feed for an hour during
  // the 2026-07-03 backend deploy window.
  const { posts } = await getNewsPosts(toAppLocale(locale));

  return <NewsListView posts={posts} />;
}
