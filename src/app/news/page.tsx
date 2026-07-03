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
  // No error swallowing: transient backend failures are retried inside
  // getNewsPosts; a persistent one must THROW — a failed build keeps the
  // previous deployment live, a failed ISR regeneration keeps the stale page.
  // Swallowing into `posts = []` cached an EMPTY news feed for an hour during
  // the 2026-07-03 backend deploy window.
  const { posts } = await getNewsPosts();

  return <NewsListView posts={posts} />;
}
