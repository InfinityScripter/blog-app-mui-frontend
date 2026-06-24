import { paramCase } from "src/utils/change-case";
import { getPost, getPosts } from "src/actions/blog-ssr";
// Import directly from the view file (not the barrel) — the barrel re-exports
// the dashboard post editor, which would drag tiptap/dropzone/etc into this
// public bundle.
import { PostDetailsHomeView } from "src/sections/blog/view/post-details-home-view";

// ----------------------------------------------------------------------

const BASE_URL = "https://talalaev.su";

export async function generateMetadata({ params }: PageProps) {
  try {
    const { id } = await params;
    const { post } = await getPost(id);
    const title = post?.title ?? "Статья";
    const description = post?.description ?? "Читать на talalaev.su";
    const image = post?.coverUrl ?? `${BASE_URL}/assets/og-image.jpg`;
    return {
      title,
      description,
      alternates: { canonical: `${BASE_URL}/post/${id}/` },
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/post/${id}/`,
        type: "article",
        images: [{ url: image, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
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
  const { post, latestPosts } = await getPost(id); // getPost получает id

  // Article JSON-LD → rich result in Google/Yandex (headline, image, date,
  // author) instead of a bare blue link. Built from the same post payload.
  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description,
        image: post.coverUrl ? [post.coverUrl] : undefined,
        datePublished: post.createdAt,
        dateModified: post.updatedAt ?? post.createdAt,
        author: { "@type": "Person", name: "Михаил Талалаев" },
        mainEntityOfPage: `${BASE_URL}/post/${id}/`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
