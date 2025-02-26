import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { PostDetailsView } from 'src/sections/blog/view';

export const metadata = { title: `Post details | Dashboard - ${CONFIG.site.name}` };

export default async function Page({ params }) {
  const { id } = params;
  const { post } = await getPost(id);
  return <PostDetailsView initialPost={post} />
}

async function getPost(id) {
  const URL = id ? `${endpoints.post.details}?id=${id}` : '';
  const res = await axios.get(URL);
  return res.data;
}

const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };

export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    const res = await axios.get(endpoints.post.list);
    return res.data.posts.map((post) => ({ id: post._id }));
  }
  return [];
}
