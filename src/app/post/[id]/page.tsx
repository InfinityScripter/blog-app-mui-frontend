import { notFound } from "next/navigation";
import { CONFIG } from "src/config-global";
import { paramCase } from "src/utils/change-case";
import { NotFoundError } from "src/utils/fetch-retry";
import { getPost, getPosts } from "src/actions/blog-ssr";
import { parsePostContent } from "src/utils/post-geo-content";
// Import directly from the view file (not the barrel) — the barrel re-exports
// the dashboard post editor, which would drag tiptap/dropzone/etc into this
// public bundle.
import { PostDetailsHomeView } from "src/sections/blog/view/post-details-home-view";

import { buildFaqJsonLd, buildPostJsonLd } from "./json-ld";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

export async function generateMetadata({ params }: PageProps) {
  try {
    const { id } = await params;
    const { post } = await getPost(id);
    const title = post?.title ?? "Статья";
    const description = post?.description ?? "Читать на aifirst.us.com";
    // A real uploaded cover wins as og:image. Otherwise omit images here and let
    // the file-convention per-post image (opengraph-image.tsx) be canonical —
    // no hardcoded /assets/og-image.jpg fallback (that file never existed).
    const images = post?.coverUrl
      ? [{ url: post.coverUrl, width: 1200, height: 630, alt: title }]
      : undefined;
    return {
      title,
      description,
      alternates: { canonical: `${BASE_URL}/post/${id}/` },
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/post/${id}/`,
        type: "article",
        ...(images && { images }),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(post?.coverUrl && { images: [post.coverUrl] }),
      },
    };
  } catch {
    return { title: "Статья | Talalaev" };
  }
}

// ISR: prerender post pages and refresh them at most once per hour. Replaces
// the previous force-dynamic export, which made every request a cold render.
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // Only a REAL backend 404 (post deleted/unknown) becomes notFound(). Any
  // other failure — after getPost's built-in retries — is rethrown: at build
  // time that fails the deploy (the previous, working deployment stays live);
  // at ISR-regeneration time Next keeps serving the stale page. Swallowing
  // everything into notFound() here is what cached every post as a 404 for an
  // hour during the 2026-07-03 backend deploy window.
  let post: Awaited<ReturnType<typeof getPost>>["post"];
  let latestPosts: Awaited<ReturnType<typeof getPost>>["latestPosts"];
  try {
    ({ post, latestPosts } = await getPost(id));
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  // NewsArticle (for `новости` posts, with source attribution) or Article (for
  // authored blog posts) → rich result in Google/Yandex instead of a bare link.
  const jsonLd = buildPostJsonLd(post, id);

  // Parse a `## FAQ` section out of the content and emit FAQPage schema so the
  // post can win an FAQ rich result. Same parse the client view runs — cheap,
  // pure — but done here it lands in the static/ISR HTML for crawlers.
  const { faq } = parsePostContent(post?.content);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <PostDetailsHomeView post={post} latestPosts={latestPosts} />
    </>
  );
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
