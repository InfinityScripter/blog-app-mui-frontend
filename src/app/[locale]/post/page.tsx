import { CONFIG } from "src/config-global";
import { getTranslations } from "next-intl/server";
import { getBlogPosts } from "src/actions/blog-ssr";
import { localizedAlternates } from "src/utils/seo-alternates";
// Import directly from the view file (not the barrel) — the barrel re-exports
// the dashboard post editor, which would drag tiptap/dropzone/etc into this
// public bundle.
import { PostListHomeView } from "src/sections/blog/view/post-list-home-view";

// ----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.meta" });
  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, "/post/"),
    openGraph: {
      title: t("ogTitle"),
      description: t("description"),
      url: `${CONFIG.site.url}/${locale}/post/`,
      type: "website",
    },
  };
}

// ISR: serve a cached blog list, refreshed at most hourly (getPosts uses a
// native fetch with the same revalidate window).
export const revalidate = 3600;

export default async function Page() {
  // Rendered from the ORIGINAL (Russian) posts. Like the news feed, the blog
  // list is NOT translated server-side — a per-request feed translation risks
  // the serverless timeout and re-burns the DeepL quota on every ISR refresh.
  // List CHROME is localized via next-intl; a post's BODY is machine-translated
  // when opened (/post/[id]). List item titles stay in the original.
  //
  // No error swallowing: transient backend failures are retried inside
  // getBlogPosts; a persistent one must THROW — a failed build keeps the
  // previous deployment live, a failed ISR regeneration keeps the stale page.
  const { posts } = await getBlogPosts();

  return <PostListHomeView posts={posts} />;
}
