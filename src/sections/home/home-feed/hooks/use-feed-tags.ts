import type { Post } from "src/types/domain";

import { useMemo } from "react";
import { PUBLISH_STATUS } from "src/types/domain";
import { NEWS_TAG } from "src/sections/news/const";

import { FEED_TAGS_LIMIT } from "../const";

// ----------------------------------------------------------------------

interface UseFeedTagsOptions {
  /** Cap on how many chips to show. Most-frequent tags win the slots. */
  limit?: number;
  /**
   * Tags to always keep visible even if they fall outside the `limit` (the
   * currently-selected ones). Without this a rare selected tag would vanish
   * from the row the moment the list is capped, which reads as a broken filter.
   */
  pinned?: string[];
}

/**
 * Filter chips for the feed are derived from the tags that ACTUALLY exist on
 * published posts — never a hardcoded list. Tags are returned distinct,
 * ordered by how many posts carry them (most common first), de-duplicated
 * case-insensitively (first-seen casing kept), then capped to `limit` so the
 * row stays short (Habr/vc.ru style) instead of listing every rare tag.
 *
 * The system `NEWS_TAG` («новости») is excluded: it's a routing marker stamped
 * on every news post, not a topic the reader would filter by. Any `pinned` tag
 * (a current selection) is always kept, in its natural frequency position.
 */
export function useFeedTags(
  posts: Post[],
  options: UseFeedTagsOptions = {},
): string[] {
  const { limit = FEED_TAGS_LIMIT, pinned = [] } = options;

  // Stable primitive so the memo doesn't re-run on every new array identity.
  const pinnedKey = pinned
    .map((t) => t.toLowerCase().trim())
    .sort()
    .join("|");

  return useMemo(() => {
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

    const ordered = Array.from(counts.values()).sort(
      (a, b) => b.count - a.count || a.label.localeCompare(b.label),
    );

    const pinnedKeys = new Set(pinnedKey ? pinnedKey.split("|") : []);

    // Keep the top `limit` plus any pinned (selected) tag that ranked lower,
    // preserving the overall frequency order.
    return ordered
      .filter(
        (entry, index) =>
          index < limit || pinnedKeys.has(entry.label.toLowerCase()),
      )
      .map((entry) => entry.label);
  }, [posts, limit, pinnedKey]);
}
