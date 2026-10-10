import type { Post } from "src/types/domain";

import { PUBLISH_STATUS } from "src/types/domain";
import { NEWS_TAG } from "src/sections/news/const";

// ----------------------------------------------------------------------

/** Toggle a tag in/out of the selected set. */
export function toggleTag(selected: string[], tag: string): string[] {
  return selected.includes(tag)
    ? selected.filter((t) => t !== tag)
    : [...selected, tag];
}

/**
 * Distinct tags carried by published posts, ordered by how many posts use them
 * (most common first, ties alphabetical), de-duplicated case-insensitively with
 * the first-seen casing kept. The system `NEWS_TAG` («новости») is dropped: it's
 * a routing marker stamped on every news post, not a topic a reader filters by.
 *
 * Pure so the SERVER can rank the whole corpus once per ISR render — the home
 * feed only holds the pages it has loaded, and ranking 10 posts would show a
 * near-random handful of the 37 tags the corpus actually has.
 */
export function rankPostTags(posts: Post[]): string[] {
  const counts = new Map<string, { label: string; count: number }>();

  posts
    .filter((post) => post.publish === PUBLISH_STATUS.published)
    .forEach((post) => {
      (post.tags ?? []).forEach((raw) => {
        const label = raw.trim();
        if (!label) return;

        const key = label.toLowerCase();
        if (key === NEWS_TAG.toLowerCase()) return;

        const existing = counts.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(key, { label, count: 1 });
        }
      });
    });

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .map((entry) => entry.label);
}

/**
 * Trims a ranked tag list to `limit` chips so the filter row stays short
 * (Habr/vc.ru style) instead of listing every rare tag, keeping any `pinned`
 * (currently selected) tag that ranked below the cut in its natural position —
 * without it a rare selected tag would vanish the moment the list is capped,
 * which reads as a broken filter.
 */
export function capFeedTags(
  ranked: string[],
  limit: number,
  pinned: string[],
): string[] {
  const pinnedKeys = new Set(pinned.map((tag) => tag.toLowerCase().trim()));
  return ranked.filter(
    (tag, index) => index < limit || pinnedKeys.has(tag.toLowerCase().trim()),
  );
}
