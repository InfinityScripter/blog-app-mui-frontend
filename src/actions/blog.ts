import type {
  PostResponse,
  ListPostsResponse,
  SearchPostsResponse,
} from "src/types/api";

import useSWR from "swr";
import { useLocale } from "next-intl";
import useSWRInfinite from "swr/infinite";
import { useMemo, useCallback } from "react";
import { langQuery } from "src/utils/lang-param";
import { fetcher, endpoints } from "src/utils/axios";
import { DEFAULT_LOCALE, type AppLocale } from "src/i18n/locales";

// useLocale() returns a plain string; narrow it to AppLocale (routing
// guarantees the value is a supported locale) without a type assertion.
function activeLocale(value: string): AppLocale {
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

interface UseGetPostsOptions {
  /** Exclude posts carrying this tag (e.g. 'новости' to hide news from the feed). */
  excludeTag?: string;
  /**
   * Cap the number of posts. Passing this switches the backend to its paginated
   * path, which returns posts newest-first (the unbounded default is ASC). Use
   * for "recent posts" widgets that want the latest N without client sorting.
   */
  limit?: number;
  /**
   * Server-fetched posts to seed SWR with. Lets a route SSR the initial feed
   * (crawlable HTML) while the client still revalidates in the background.
   */
  fallbackData?: ListPostsResponse;
  /**
   * `false` holds the request back (SWR key `null`). This read is the UNBOUNDED
   * one — the whole corpus in a single response — so a caller that only needs it
   * conditionally (the feed's tag filter) can avoid paying for it up front.
   */
  enabled?: boolean;
}

export function useGetPosts(options: UseGetPostsOptions = {}) {
  const { excludeTag, limit, fallbackData, enabled = true } = options;
  const locale = activeLocale(useLocale());
  // Feed/list titles ARE translated for a non-original locale. The backend
  // returns each post's title/description from the translation cache (warmed
  // ahead of time — POST /api/admin/translate/warm — so this is a fast DB hit,
  // not a per-request DeepL call). `ru` sends no param → byte-identical
  // original. A post's full BODY still translates lazily on open (useGetPost).
  const params = new URLSearchParams();
  if (excludeTag) params.set("excludeTag", excludeTag);
  if (limit) params.set("limit", String(limit));
  if (locale !== DEFAULT_LOCALE) params.set("lang", locale);
  const queryString = params.toString();
  const url = queryString
    ? `${endpoints.post.list}?${queryString}`
    : endpoints.post.list;

  const { data, isLoading, error, isValidating } = useSWR<ListPostsResponse>(
    enabled ? url : null,
    fetcher,
    fallbackData ? { ...swrOptions, fallbackData } : swrOptions,
  );

  const memoizedValue = useMemo(
    () => ({
      posts: data?.posts || [],
      postsLoading: isLoading,
      postsError: error,
      postsValidating: isValidating,
      postsEmpty: !isLoading && !(data?.posts?.length ?? 0),
    }),
    [data?.posts, error, isLoading, isValidating],
  );

  return memoizedValue;
}

interface UseGetPostsInfiniteOptions {
  /** Rows per request, sent as `?limit` (the backend clamps it to 100). */
  pageSize: number;
  /**
   * Server-rendered pages to seed SWR with — `useSWRInfinite` holds one entry
   * per page, so the SSR first page is passed as a single-element array. Lets
   * the route ship crawlable HTML without a client round-trip for page 1.
   */
  fallbackData?: ListPostsResponse[];
}

/**
 * The public feed, read one page at a time. Passing `?page`/`?limit` switches
 * the backend to its paginated path: newest-first rows plus `{ total, hasMore }`
 * instead of the entire corpus in one response (146 posts ≈ 250 KB today, and
 * growing by ~2 posts a day). Callers that genuinely need every row — sitemap,
 * llms.txt, generateStaticParams — keep using the unbounded `getPosts()`.
 */
export function useGetPostsInfinite(options: UseGetPostsInfiniteOptions) {
  const { pageSize, fallbackData } = options;
  const locale = activeLocale(useLocale());

  // Returning null stops SWR from requesting a page past the end of the feed.
  const getKey = (index: number, previous: ListPostsResponse | null) => {
    if (previous && !previous.hasMore) return null;
    const params = new URLSearchParams({
      page: String(index + 1),
      limit: String(pageSize),
    });
    if (locale !== DEFAULT_LOCALE) params.set("lang", locale);
    return `${endpoints.post.list}?${params.toString()}`;
  };

  const { data, error, size, setSize } = useSWRInfinite<ListPostsResponse>(
    getKey,
    fetcher,
    {
      ...swrOptions,
      fallbackData,
      // Page 1 arrives from SSR; re-fetching it on every "load more" would
      // re-download a page we already hold.
      revalidateFirstPage: false,
    },
  );

  const loadMore = useCallback(() => {
    setSize((current) => current + 1);
  }, [setSize]);

  return useMemo(() => {
    const pages = data ?? [];
    const lastPage = pages[pages.length - 1];
    return {
      posts: pages.flatMap((page) => page.posts),
      // Derived from the page array, NOT from SWR's isLoading/isValidating:
      // when `fallbackData` is supplied those stay true indefinitely (SWR skips
      // the mount revalidation but never clears the flags), so gating on them
      // wedges "load more" shut. `data` is the honest signal.
      postsLoading: pages.length === 0,
      // A requested page that hasn't landed yet leaves `data` short of `size`.
      // Callers gate "load more" on this so one long scroll can't queue several
      // page requests at once.
      postsLoadingMore: pages.length < size,
      postsError: error,
      hasMore: lastPage ? Boolean(lastPage.hasMore) : false,
      loadMore,
    };
  }, [data, error, size, loadMore]);
}

export function useGetPost(postId?: string) {
  const locale = activeLocale(useLocale());
  const key = postId
    ? `${endpoints.post.details}?id=${postId}${langQuery(locale, true)}`
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR<PostResponse>(
    key,
    fetcher,
    swrOptions,
  );

  return useMemo(
    () => ({
      post: data?.post,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
      postMutate: mutate,
    }),
    [data?.post, error, isLoading, isValidating, mutate],
  );
}

export function useSearchPosts(query?: string, dashboard: boolean = false) {
  const locale = activeLocale(useLocale());
  // The query always runs against the ORIGINAL (Russian) text server-side; only
  // the returned titles/descriptions are translated for a non-original locale
  // (a warmed-cache DB hit, like the feed). `ru` omits the param → original.
  const url = query
    ? [
        endpoints.post.search,
        {
          params:
            locale === DEFAULT_LOCALE
              ? { query, dashboard }
              : { query, dashboard, lang: locale },
        },
      ]
    : "";

  const { data, isLoading, error, isValidating } = useSWR<SearchPostsResponse>(
    url,
    fetcher,
    {
      ...swrOptions,
      keepPreviousData: true,
    },
  );

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !(data?.results?.length ?? 0),
    }),
    [data?.results, error, isLoading, isValidating],
  );

  return memoizedValue;
}
