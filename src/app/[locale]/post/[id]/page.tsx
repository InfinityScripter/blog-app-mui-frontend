import { notFound } from "next/navigation";
import { CONFIG } from "src/config-global";
import { paramCase } from "src/utils/change-case";
import { NotFoundError } from "src/utils/fetch-retry";
import { getPost, getPosts } from "src/actions/blog-ssr";
import { parsePostContent } from "src/utils/post-geo-content";
import { serializeJsonLd } from "src/utils/serialize-json-ld";
import { toAppLocale, DEFAULT_LOCALE } from "src/i18n/locales";
import { localizedAlternates } from "src/utils/seo-alternates";
// Import directly from the view file (not the barrel) — the barrel re-exports
// the dashboard post editor, which would drag tiptap/dropzone/etc into this
// public bundle.
import { PostDetailsHomeView } from "src/sections/blog/view/post-details-home-view";

import { buildFaqJsonLd, buildPostJsonLd } from "./json-ld";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

export async function generateMetadata({ params }: PageProps) {
  try {
    const { id, locale } = await params;
    const { post } = await getPost(id, toAppLocale(locale));
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
      ...localizedAlternates(locale, `/post/${id}/`),
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/${locale}/post/${id}/`,
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
  params: Promise<{ id: string; locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, locale } = await params;

  // Only a REAL backend 404 (post deleted/unknown) becomes notFound(). Any
  // other failure — after getPost's built-in retries — is rethrown: at build
  // time that fails the deploy (the previous, working deployment stays live);
  // at ISR-regeneration time Next keeps serving the stale page. Swallowing
  // everything into notFound() here is what cached every post as a 404 for an
  // hour during the 2026-07-03 backend deploy window.
  let post: Awaited<ReturnType<typeof getPost>>["post"];
  let latestPosts: Awaited<ReturnType<typeof getPost>>["latestPosts"];
  try {
    ({ post, latestPosts } = await getPost(id, toAppLocale(locale)));
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
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      )}
      <PostDetailsHomeView post={post} latestPosts={latestPosts} />
    </>
  );
}

// ----------------------------------------------------------------------

// Cap on how many post pages are prerendered at build time. The backend's
// per-IP detail rate-limit is 60 req/min; a Vercel build fetches these pages
// concurrently, so prerendering ALL posts (109 and growing) bursts past the cap
// and a 429 kills the deploy. Prerender only the newest N and let the older tail
// render on demand on first request, then ISR-cache (same `revalidate`). Keep
// N < 60. Measured: a build issues exactly N `/api/post/details` calls for these
// pages — Next's fetch cache dedupes the sibling getPost in opengraph-image.tsx
// against page.tsx's (same URL + revalidate init), so there is no 2× doubling.
const PRERENDER_POST_LIMIT = 40;

/**
 * Prerender a bounded set of published posts at build time — the newest
 * PRERENDER_POST_LIMIT, and ONLY for the default locale (Russian original):
 *   - Older posts beyond the cap render on demand on first request
 *     (dynamicParams defaults to true) and are then ISR-cached. This keeps the
 *     build-time detail fetch volume under the backend's 60/min rate-limit so a
 *     large corpus can't 429 the deploy.
 *   - `en` variants are machine-translated per post on the backend; prebuilding
 *     every post × locale would double the fetch volume — they too render on
 *     demand and ISR-cache.
 *   - Any unknown id also renders on demand.
 * Wrapped so an unreachable backend at build time yields no params instead of
 * failing the build.
 */
export async function generateStaticParams(): Promise<
  Array<{ locale: string; id: string }>
> {
  try {
    const { posts } = await getPosts();
    // The list endpoint returns oldest-first; sort newest-first so the cap keeps
    // the FRESH posts prerendered (the tail we defer is the least-visited old
    // posts). A missing OR unparseable createdAt (NaN) sorts last (as 0) so it
    // can't scramble the ordering of the valid-dated posts.
    const time = (value?: string | Date): number => {
      const ms = value ? new Date(value).getTime() : 0;
      return Number.isNaN(ms) ? 0 : ms;
    };
    const newestFirst = [...posts].sort(
      (a, b) => time(b.createdAt) - time(a.createdAt),
    );
    return newestFirst.slice(0, PRERENDER_POST_LIMIT).map((post) => {
      // The backend serialises the primary key as `_id`; `id`/`title` are
      // fallbacks for older shapes.
      const { _id, id, title } = post;
      return { locale: DEFAULT_LOCALE, id: _id ?? id ?? paramCase(title) };
    });
  } catch {
    return [];
  }
}
