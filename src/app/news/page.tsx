import { CONFIG } from "src/config-global";
import { getNewsPosts } from "src/actions/blog-ssr";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { NewsListView } from "src/sections/news/view/news-list-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Новости - ${CONFIG.site.name}` };

// ISR: serve a cached news feed, refreshed at most hourly (getNewsPosts uses a
// native fetch with the same revalidate window).
export const revalidate = 3600;

export default async function Page() {
  // An unreachable backend at build time must not fail the build: fall back to
  // an empty list and let ISR refill on the next revalidate.
  let posts: Awaited<ReturnType<typeof getNewsPosts>>["posts"] = [];
  try {
    ({ posts } = await getNewsPosts());
  } catch {
    posts = [];
  }

  return <NewsListView posts={posts} />;
}
