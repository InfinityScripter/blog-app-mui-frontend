import { CONFIG } from "src/config-global";
import { getBlogPosts } from "src/actions/blog-ssr";
// Import directly from the view file (not the barrel) — the barrel re-exports
// the dashboard post editor, which would drag tiptap/dropzone/etc into this
// public bundle.
import { PostListHomeView } from "src/sections/blog/view/post-list-home-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Блог",
  description:
    "Статьи Михаила Талалаева о веб-разработке, React, Next.js и TypeScript.",
  alternates: { canonical: `${CONFIG.site.url}/post/` },
  openGraph: {
    title: "Блог | Talalaev",
    description:
      "Статьи Михаила Талалаева о веб-разработке, React, Next.js и TypeScript.",
    url: `${CONFIG.site.url}/post/`,
    type: "website",
  },
};

// ISR: serve a cached blog list, refreshed at most hourly (getPosts uses a
// native fetch with the same revalidate window).
export const revalidate = 3600;

export default async function Page() {
  // No error swallowing: transient backend failures are retried inside
  // getBlogPosts; a persistent one must THROW — a failed build keeps the
  // previous deployment live, a failed ISR regeneration keeps the stale page.
  // Swallowing into `posts = []` cached an EMPTY blog list for an hour during
  // the 2026-07-03 backend deploy window.
  const { posts } = await getBlogPosts();

  return <PostListHomeView posts={posts} />;
}
