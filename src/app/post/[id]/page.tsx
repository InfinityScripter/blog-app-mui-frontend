import { CONFIG } from "src/config-global";
import { paramCase } from "src/utils/change-case";
import { getPost, getPosts } from "src/actions/blog-ssr";
// Import directly from the view file (not the barrel) — the barrel re-exports
// the dashboard post editor, which would drag tiptap/dropzone/etc into this
// public bundle.
import { PostDetailsHomeView } from "src/sections/blog/view/post-details-home-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Post details - ${CONFIG.site.name}` };

// ISR: prerender post pages and refresh them at most once per hour. Replaces
// the previous force-dynamic export, which made every request a cold render.
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const { post, latestPosts } = await getPost(id); // getPost получает id
  return <PostDetailsHomeView post={post} latestPosts={latestPosts} />;
}

// ----------------------------------------------------------------------

/**
 * Prerender the published posts at build time; unknown ids still render on
 * demand (dynamicParams defaults to true) and are then cached by ISR. The
 * fetch is wrapped so an unreachable backend at build time yields no params
 * instead of failing the build.
 */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  try {
    const { posts } = await getPosts();
    return posts.map((post) => {
      // The backend serialises the primary key as `_id`; `id`/`title` are
      // fallbacks for older shapes.
      const { _id, id, title } = post;
      return { id: _id ?? id ?? paramCase(title) };
    });
  } catch {
    return [];
  }
}
