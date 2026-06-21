import type { Post } from "src/types/domain";

import { MAX_RELATED } from "./const";

// ----------------------------------------------------------------------

/** Lowercased, trimmed tag set for overlap comparison. */
export function normalizeTags(tags: string[] = []): Set<string> {
  return new Set(tags.map((t) => t.toLowerCase().trim()));
}

/**
 * Picks up to 3 published posts sharing the most tags with the current one,
 * excluding the current post. Falls back to newest posts when nothing overlaps
 * so the block is never empty when other posts exist.
 */
export function selectRelated(
  posts: Post[],
  currentPostId: string | undefined,
  tags: string[],
): Post[] {
  const currentTags = normalizeTags(tags);

  const candidates = posts.filter(
    (post) => post.publish === "published" && post.id !== currentPostId,
  );

  const scored = candidates
    .map((post) => {
      const overlap = Array.from(normalizeTags(post.tags)).filter((t) =>
        currentTags.has(t),
      ).length;
      return { post, overlap };
    })
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      const aTime = a.post.createdAt ? new Date(a.post.createdAt).getTime() : 0;
      const bTime = b.post.createdAt ? new Date(b.post.createdAt).getTime() : 0;
      return bTime - aTime;
    });

  return scored.slice(0, MAX_RELATED).map((s) => s.post);
}
