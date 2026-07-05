import { CONFIG } from "src/config-global";
import { toAppLocale } from "src/i18n/locales";
import { getTranslations } from "next-intl/server";
import { getBlogPosts } from "src/actions/blog-ssr";
import { localizedAlternates } from "src/utils/seo-alternates";
import { defaultLocaleStaticParams } from "src/i18n/static-params";
// Import directly from the view file (not the barrel) — the barrel re-exports
// the dashboard post editor, which would drag tiptap/dropzone/etc into this
// public bundle.
import { PostListHomeView } from "src/sections/blog/view/post-list-home-view";

// ----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Prebuild only /ru/post; /en/post renders on demand + ISR (translates the list
// lazily, once) so the build never translates the whole blog list.
export const generateStaticParams = defaultLocaleStaticParams;

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

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  // No error swallowing: transient backend failures are retried inside
  // getBlogPosts; a persistent one must THROW — a failed build keeps the
  // previous deployment live, a failed ISR regeneration keeps the stale page.
  // Swallowing into `posts = []` cached an EMPTY blog list for an hour during
  // the 2026-07-03 backend deploy window.
  const { posts } = await getBlogPosts(toAppLocale(locale));

  return <PostListHomeView posts={posts} />;
}
