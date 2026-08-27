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

// Литерал обязателен: вычисляемый `export { dynamic }` Next статически не
// распознаёт и молча игнорирует (билд предупреждал «can't recognize the
// exported dynamic field»). Ветка isStaticExport была мёртвой — next.config
// жёстко инжектит BUILD_STATIC_EXPORT="false".
export const dynamic = "force-dynamic";
