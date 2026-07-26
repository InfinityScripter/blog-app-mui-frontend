import type { Post } from "src/types/domain";

import { useMemo } from "react";

import { FEED_TAGS_LIMIT } from "../const";
import { capFeedTags, rankPostTags } from "../utils";

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
  /**
   * Tag vocabulary already ranked over the FULL corpus (server-side, see
   * `rankPostTags`). When given, `posts` is not ranked at all — the paginated
   * home feed holds only the pages it has loaded, so ranking client-side there
   * would show the tags of the ten newest posts instead of the whole blog.
   */
  ranked?: string[];
}

/**
 * Filter chips for the feed are derived from the tags that ACTUALLY exist on
 * published posts — never a hardcoded list. Ranking, de-duplication and the
 * `NEWS_TAG` exclusion live in `rankPostTags`; capping and pinning in
 * `capFeedTags`. Callers that hold the whole corpus (the /post blog list) pass
 * `posts`; the paginated home feed passes a server-ranked `ranked` list.
 */
export function useFeedTags(
  posts: Post[],
  options: UseFeedTagsOptions = {},
): string[] {
  const { limit = FEED_TAGS_LIMIT, pinned = [], ranked } = options;

  // Stable primitive so the memo doesn't re-run on every new array identity.
  const pinnedKey = pinned
    .map((t) => t.toLowerCase().trim())
    .sort()
    .join("|");

  return useMemo(
    () =>
      capFeedTags(
        ranked ?? rankPostTags(posts),
        limit,
        pinnedKey ? pinnedKey.split("|") : [],
      ),
    [posts, limit, pinnedKey, ranked],
  );
}
