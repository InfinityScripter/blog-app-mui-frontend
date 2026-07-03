import { CONFIG } from "src/config-global";
import { getPosts, getPostsByTag } from "src/actions/blog-ssr";
// Import directly from the view file (not the barrel) — the barrel re-exports
// the dashboard post editor, which would drag tiptap/dropzone/etc into this
// public bundle.
import { TagListView } from "src/sections/blog/view/tag-list-view";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

// On the on-demand/dynamicParams path Next may hand us an already-decoded slug;
// a tag with a literal "%" + non-hex would make decodeURIComponent throw. Degrade
// to the raw value instead of 500-ing.
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// ISR: prerender tag pages and refresh at most once per hour.
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const decoded = safeDecode(slug);
  const title = `Тег: ${decoded}`;
  return {
    title,
    description: `Посты с тегом «${decoded}» на ${CONFIG.site.name}`,
    // Encode the raw (case-sensitive, possibly Cyrillic) tag; trailing slash
    // matches next.config trailingSlash:true.
    alternates: {
      canonical: `${BASE_URL}/tag/${encodeURIComponent(decoded)}/`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const decoded = safeDecode(slug);

  // No error swallowing: transient backend failures are retried inside
  // getPostsByTag; a persistent one must THROW instead of ISR-caching an empty
  // archive for an hour (2026-07-03 incident). An unknown tag is a legitimate
  // 200 + empty list from the backend, not an error.
  const { posts } = await getPostsByTag(decoded);

  return <TagListView tag={decoded} posts={posts} />;
}

// ----------------------------------------------------------------------

/**
 * Prerender the distinct tags at build time; unknown tags still render on
 * demand (dynamicParams defaults to true) and are cached by ISR. Wrapped so an
 * unreachable backend at build time yields no params instead of failing.
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const { posts } = await getPosts();
    const tags = posts.flatMap((post) => post.tags ?? []);
    const distinct = Array.from(new Set(tags));
    return distinct.map((tag) => ({ slug: encodeURIComponent(tag) }));
  } catch {
    return [];
  }
}
