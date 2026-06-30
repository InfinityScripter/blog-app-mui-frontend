import { CONFIG } from "src/config-global";
import { getNewsPosts } from "src/actions/blog-ssr";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { NewsListView } from "src/sections/news/view/news-list-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "AI-лента новостей: искусственный интеллект, IT, технологии",
  description:
    "AI-лента новостей: нейросеть (LLM) автоматически собирает источники, фильтрует и кратко пересказывает свежие новости об искусственном интеллекте, IT и технологиях.",
  alternates: { canonical: `${CONFIG.site.url}/news/` },
  openGraph: {
    title: "AI-лента новостей: AI, IT, технологии | Talalaev",
    description:
      "Нейросеть автоматически собирает и кратко пересказывает свежие новости об искусственном интеллекте, IT и технологиях.",
    url: `${CONFIG.site.url}/news/`,
    type: "website",
  },
};

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
