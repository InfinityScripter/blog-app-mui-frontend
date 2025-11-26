import { paramCase } from "src/utils/change-case";
import axios, { endpoints } from "src/utils/axios";

import { CONFIG } from "src/config-global";
import { getPost } from "src/actions/blog-ssr";

import { PostDetailsHomeView } from "src/sections/blog/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Post details - ${CONFIG.site.name}` };

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
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? "auto" : "force-dynamic";

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  if (CONFIG.isStaticExport) {
    const res = await axios.get<{ posts: Array<{ title: string; _id?: string; id?: string }> }>(endpoints.post.list);
    return res.data.posts.map((post) => ({ id: post._id ?? post.id ?? paramCase(post.title) }));
  }
  return [];
}
