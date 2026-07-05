import type {
  PostResponse,
  ListPostsResponse,
  SearchPostsResponse,
} from "src/types/api";

import useSWR from "swr";
import { useMemo } from "react";
import { useLocale } from "next-intl";
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
}

export function useGetPosts(options: UseGetPostsOptions = {}) {
  const { excludeTag, limit } = options;
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
    url,
    fetcher,
    swrOptions,
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
