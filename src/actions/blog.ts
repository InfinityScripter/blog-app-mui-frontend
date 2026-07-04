import type {
  PostResponse,
  ListPostsResponse,
  SearchPostsResponse,
} from "src/types/api";

import useSWR from "swr";
import { useMemo } from "react";
import { fetcher, endpoints } from "src/utils/axios";

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
  const params = new URLSearchParams();
  if (excludeTag) params.set("excludeTag", excludeTag);
  if (limit) params.set("limit", String(limit));
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
  const key = postId ? `${endpoints.post.details}?id=${postId}` : null;

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
  const url = query
    ? [endpoints.post.search, { params: { query, dashboard } }]
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
