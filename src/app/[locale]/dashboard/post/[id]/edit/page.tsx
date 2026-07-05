import type { PostResponse } from "src/types/api";

import { CONFIG } from "src/config-global";
import axios, { endpoints } from "src/utils/axios";
import { PostEditView } from "src/sections/blog/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: `Post edit | Dashboard - ${CONFIG.site.name}`,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const { post } = await getPost(id);

  return <PostEditView post={post} />;
}

// ----------------------------------------------------------------------

async function getPost(id: string): Promise<PostResponse> {
  const URL = id ? `${endpoints.post.details}?id=${id}` : "";

  const res = await axios.get<PostResponse>(URL);

  return res.data;
}

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
    const res = await axios.get<{ posts: Array<{ id: string }> }>(
      endpoints.post.list,
    );

    return res.data.posts.map((post) => ({ id: post.id }));
  }
  return [];
}
