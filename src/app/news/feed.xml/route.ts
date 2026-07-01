import { CONFIG } from "src/config-global";
import { buildRssFeed } from "src/utils/feed-xml";
import { getNewsPosts } from "src/actions/blog-ssr";

// ----------------------------------------------------------------------

// News RSS feed (только посты с тегом новости). ISR-cached.
export const revalidate = 3600;

export async function GET() {
  let posts: Awaited<ReturnType<typeof getNewsPosts>>["posts"] = [];
  try {
    ({ posts } = await getNewsPosts());
  } catch {
    // backend unreachable at build time — emit an empty feed (mirror sitemap.ts)
    posts = [];
  }

  const xml = buildRssFeed({
    posts,
    feedTitle: `${CONFIG.site.name} — Новости`,
    feedDescription:
      "AI-агрегатор новостей: свежие новости об AI, IT и технологиях",
    feedUrl: `${CONFIG.site.url}/news/`,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
