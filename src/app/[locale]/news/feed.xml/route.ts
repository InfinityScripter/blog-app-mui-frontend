import type { Post } from "src/types/domain";

import { CONFIG } from "src/config-global";
import { toAppLocale } from "src/i18n/locales";
import { buildRssFeed } from "src/utils/feed-xml";
import { getTranslations } from "next-intl/server";
import { getNewsPosts } from "src/actions/blog-ssr";

// ----------------------------------------------------------------------

// News RSS feed (только посты с тегом новости). Per-locale: /ru/news/feed.xml
// serves the Russian originals, /en/news/feed.xml the translated titles/desc.
// ISR-cached.
export const revalidate = 3600;

interface RouteContext {
  params: Promise<{ locale: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { locale } = await params;
  const lang = toAppLocale(locale);
  const t = await getTranslations({ locale, namespace: "news" });

  // Per-item links point at the locale-prefixed post URL so the EN feed links
  // to the EN post (the app runs localePrefix: "always" + trailingSlash: true).
  const linkFor = (post: Post): string => {
    const id = post._id ?? post.id ?? "";
    return `${CONFIG.site.url}/${lang}/post/${id}/`;
  };

  let posts: Awaited<ReturnType<typeof getNewsPosts>>["posts"] = [];
  try {
    ({ posts } = await getNewsPosts(lang));
  } catch {
    // backend unreachable at build time — emit an empty feed (mirror sitemap.ts)
    posts = [];
  }

  const xml = buildRssFeed({
    posts,
    feedTitle: `${CONFIG.site.name} — ${t("feed.title")}`,
    feedDescription: t("feed.description"),
    feedUrl: `${CONFIG.site.url}/${lang}/news/`,
    language: lang,
    linkFor,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
