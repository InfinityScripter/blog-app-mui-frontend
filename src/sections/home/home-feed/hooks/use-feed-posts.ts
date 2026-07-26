"use client";

import type { Post } from "src/types/domain";
import type { ListPostsResponse } from "src/types/api";

import { useMemo, useState, useCallback } from "react";
import { useGetPosts, useGetPostsInfinite } from "src/actions/blog";

import { FEED_PAGE_SIZE } from "../const";
import { selectFeedPosts } from "../utils";

// ----------------------------------------------------------------------

interface UseFeedPostsOptions {
  /** Tags the reader picked. Empty — the default, paginated reading path. */
  selectedTags: string[];
  /** SSR-rendered first page, seeding the paginated read (crawlable HTML). */
  initialPage?: ListPostsResponse;
}

interface UseFeedPostsReturn {
  /** Posts to render: published only, newest first, narrowed to the selection. */
  posts: Post[];
  /** The feed has nothing to show yet — suppress the "empty" copy until settled. */
  loading: boolean;
  /** More posts exist past what's rendered. */
  hasMore: boolean;
  /** Reveal the next page. A no-op while a page request is already in flight. */
  loadMore: () => void;
  /** Drop back to one page. Call when the tag selection changes. */
  resetPaging: () => void;
}

/**
 * The home feed's data source, in two modes.
 *
 * **Unfiltered (the default).** Posts arrive a page at a time from the
 * backend's paginated path, seeded by the SSR first page. Reading the feed
 * therefore costs one page, not the whole corpus — which had grown to 146 posts
 * / ~250 KB per visitor and gains ~2 posts a day with no ceiling.
 *
 * **Filtered.** The chips are multi-select with OR semantics and match
 * case-insensitively across every published post; the backend's `?tag=` takes a
 * single exact tag, so it can't answer that query. This mode falls back to the
 * unbounded read and filters client-side, exactly as the feed always has — but
 * now only for readers who actually touch a chip, and only once per session.
 */
export function useFeedPosts(options: UseFeedPostsOptions): UseFeedPostsReturn {
  const { selectedTags, initialPage } = options;
  const filtering = selectedTags.length > 0;

  // `useSWRInfinite` holds one entry per page, so the SSR page is wrapped in an
  // array — memoized, because a fresh array identity on every render re-inits
  // SWR and it never settles into a stable state.
  const fallbackData = useMemo(
    () => (initialPage ? [initialPage] : undefined),
    [initialPage],
  );

  const {
    posts: pagedPosts,
    postsLoading: pagedLoading,
    postsLoadingMore,
    hasMore: pagedHasMore,
    loadMore: loadNextPage,
  } = useGetPostsInfinite({ pageSize: FEED_PAGE_SIZE, fallbackData });

  const { posts: allPosts, postsLoading: allLoading } = useGetPosts({
    enabled: filtering,
  });

  // Only the filtered mode pages client-side; the unfiltered one renders
  // whatever the backend has handed over so far.
  const [visibleCount, setVisibleCount] = useState(FEED_PAGE_SIZE);

  const source = filtering ? allPosts : pagedPosts;
  const matching = useMemo(
    () => selectFeedPosts(source, selectedTags),
    [source, selectedTags],
  );

  const resetPaging = useCallback(() => setVisibleCount(FEED_PAGE_SIZE), []);

  const loadMore = useCallback(() => {
    if (filtering) {
      setVisibleCount((count) => count + FEED_PAGE_SIZE);
      return;
    }
    // Revealing a page is a network request now, so the scroll sentinel can
    // fire again before the previous page lands. Without this guard one long
    // scroll would queue several page requests at once.
    if (postsLoadingMore) return;
    loadNextPage();
  }, [filtering, postsLoadingMore, loadNextPage]);

  return {
    posts: filtering ? matching.slice(0, visibleCount) : matching,
    loading: filtering ? allLoading : pagedLoading,
    hasMore: filtering ? matching.length > visibleCount : pagedHasMore,
    loadMore,
    resetPaging,
  };
}
