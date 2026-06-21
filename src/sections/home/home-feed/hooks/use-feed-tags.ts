import type { Post } from "src/types/domain";

import { useMemo } from "react";
import { PUBLISH_STATUS } from "src/types/domain";
import { NEWS_TAG } from "src/sections/news/const";

// ----------------------------------------------------------------------

/**
 * Filter chips for the feed are derived from the tags that ACTUALLY exist on
 * published posts — never a hardcoded list. Tags are returned distinct,
 * ordered by how many posts carry them (most common first), and de-duplicated
 * case-insensitively while preserving the first-seen casing for display.
 *
 * The system `NEWS_TAG` («новости») is excluded: it's a routing marker stamped
 * on every news post, not a topic the reader would filter by.
 */
export function useFeedTags(posts: Post[]): string[] {
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

    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .map((entry) => entry.label);
  }, [posts]);
}
