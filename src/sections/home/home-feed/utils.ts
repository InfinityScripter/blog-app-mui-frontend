import type { Post } from "src/types/domain";

import type { FeedTag } from "./const";

// ----------------------------------------------------------------------

/** True if the post carries `tag` (case-insensitive, trimmed). */
function postHasTag(post: Post, tag: string): boolean {
  const needle = tag.toLowerCase().trim();
  return (post.tags ?? []).some((t) => t.toLowerCase().trim() === needle);
}

/**
 * Published posts, newest first, optionally narrowed to those carrying ANY of
 * the selected tags (OR semantics — matches how chip multi-select reads). An
 * empty selection means "no tag filter".
 */
export function selectFeedPosts(
  posts: Post[],
  selectedTags: FeedTag[],
): Post[] {
  const published = posts.filter((post) => post.publish === "published");

  const filtered =
    selectedTags.length === 0
      ? published
      : published.filter((post) =>
          selectedTags.some((tag) => postHasTag(post, tag)),
        );

  return [...filtered].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

/** Toggle a tag in/out of the selected set, preserving FEED_TAGS order. */
export function toggleTag(
  selected: FeedTag[],
  tag: FeedTag,
  allTags: readonly FeedTag[],
): FeedTag[] {
  const next = selected.includes(tag)
    ? selected.filter((t) => t !== tag)
    : [...selected, tag];
  return allTags.filter((t) => next.includes(t));
}
