import axios, { endpoints } from "src/utils/axios";

import { CONFIG } from "src/config-global";

import { PostDetailsView } from "src/sections/blog/view";

import type { PostResponse } from "src/types/api";

export const metadata = {
  title: `Post details | Dashboard - ${CONFIG.site.name}`,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const { post } = await getPost(id);
  return <PostDetailsView initialPost={post} />;
}

async function getPost(id: string): Promise<PostResponse> {
  const URL = id ? `${endpoints.post.details}?id=${id}` : "";
  const res = await axios.get<PostResponse>(URL);
  return res.data;
}

const dynamic = CONFIG.isStaticExport ? "auto" : "force-dynamic";
export { dynamic };

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  if (CONFIG.isStaticExport) {
    const res = await axios.get<{ posts: Array<{ _id: string }> }>(endpoints.post.list);
    return res.data.posts.map((post) => ({ id: post._id }));
  }
  return [];
}
