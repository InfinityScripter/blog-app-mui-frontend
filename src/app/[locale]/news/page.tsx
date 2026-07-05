import { CONFIG } from "src/config-global";
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

export default async function Page() {
  // The feed is rendered from the ORIGINAL (Russian) posts, not translated
  // server-side: translating a ~60-item feed synchronously per request blows
  // the serverless function timeout (10s). Feed CHROME (category tabs, labels,
  // empty states) is localized via next-intl; individual post BODIES are
  // machine-translated when opened (the /post/[id] details route). List item
  // titles stay in the original — a deliberate scope boundary for large feeds.
  //
  // No error swallowing: transient backend failures are retried inside
  // getNewsPosts; a persistent one must THROW — a failed build keeps the
  // previous deployment live, a failed ISR regeneration keeps the stale page.
  const { posts } = await getNewsPosts();

  return <NewsListView posts={posts} />;
}
