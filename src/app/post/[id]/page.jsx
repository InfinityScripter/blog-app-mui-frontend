import { paramCase } from 'src/utils/change-case';
import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';
import { getPost } from 'src/actions/blog-ssr';

import { PostDetailsHomeView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Post details - ${CONFIG.site.name}` };

export default async function Page({ params }) {
  const { id } = params;
  const { post, latestPosts } = await getPost(id); // getPost получает id
  return <PostDetailsHomeView post={post} latestPosts={latestPosts} />;
}


// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    const res = await axios.get(endpoints.post.list);
    return res.data.posts.map((post) => ({ title: paramCase(post.title) }));
  }
  return [];
}
