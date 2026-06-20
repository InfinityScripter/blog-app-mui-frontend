import { CONFIG } from "src/config-global";
import { getBlogPosts } from "src/actions/blog-ssr";
// Import directly from the view file (not the barrel) — the barrel re-exports
// the dashboard post editor, which would drag tiptap/dropzone/etc into this
// public bundle.
import { PostListHomeView } from "src/sections/blog/view/post-list-home-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Post list - ${CONFIG.site.name}` };

// ISR: serve a cached blog list, refreshed at most hourly (getPosts uses a
// native fetch with the same revalidate window).
export const revalidate = 3600;

export default async function Page() {
  // An unreachable backend at build time must not fail the build: fall back to
  // an empty list and let ISR refill the page on the next revalidate. Mirrors
  // the try/catch in post/[id]/generateStaticParams.
  let posts: Awaited<ReturnType<typeof getBlogPosts>>["posts"] = [];
  try {
    ({ posts } = await getBlogPosts());
  } catch {
    posts = [];
  }

  return <PostListHomeView posts={posts} />;
}
