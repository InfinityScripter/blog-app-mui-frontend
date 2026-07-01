import { CONFIG } from "src/config-global";
import { buildRssFeed } from "src/utils/feed-xml";
import { getBlogPosts } from "src/actions/blog-ssr";

// ----------------------------------------------------------------------

// Blog RSS feed (excludes новости — news has its own /news/feed.xml). ISR-cached.
export const revalidate = 3600;

export async function GET() {
  let posts: Awaited<ReturnType<typeof getBlogPosts>>["posts"] = [];
  try {
    ({ posts } = await getBlogPosts());
  } catch {
    // backend unreachable at build time — emit an empty feed (mirror sitemap.ts)
    posts = [];
  }

  const xml = buildRssFeed({
    posts,
    feedTitle: `${CONFIG.site.name} — Блог`,
    feedDescription:
      "Свежие посты блога: AI, IT и технологии на aifirst.us.com",
    feedUrl: `${CONFIG.site.url}/`,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
