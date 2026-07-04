import type { Post } from "src/types/domain";

import { PUBLISH_STATUS } from "src/types/domain";

import { MAX_RELATED } from "./const";

// ----------------------------------------------------------------------

/** Lowercased, trimmed tag set for overlap comparison. */
function normalizeTags(tags: string[] = []): Set<string> {
  return new Set(tags.map((t) => t.toLowerCase().trim()));
}

/** True if `tag` is one of the active filter tags (case-insensitive, trimmed). */
export function isTagActive(tag: string, activeTags: string[] = []): boolean {
  const needle = tag.toLowerCase().trim();
  return activeTags.some((t) => t.toLowerCase().trim() === needle);
}

/**
 * Reorders a post's tags so the ones matching the active filter come first,
 * keeping the original relative order otherwise. Used so a card's truncated tag
 * list always surfaces the tag the feed was filtered by.
 */
export function orderTagsByActive(
  tags: string[],
  activeTags: string[] = [],
): string[] {
  if (activeTags.length === 0) return tags;
  const matched = tags.filter((tag) => isTagActive(tag, activeTags));
  const rest = tags.filter((tag) => !isTagActive(tag, activeTags));
  return [...matched, ...rest];
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
    (post) =>
      post.publish === PUBLISH_STATUS.published && post.id !== currentPostId,
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
