import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';
import type { LatestPostsResponse, ListPostsResponse, PostResponse, SearchPostsResponse } from 'src/types/api';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetPosts() {
  const url = endpoints.post.list;

  const { data, isLoading, error, isValidating } = useSWR<ListPostsResponse>(url, fetcher, swrOptions);

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

export function useGetPost(postId?: string, title?: string) {
  const url = title ? [endpoints.post.details, { params: { title } }] : '';
  const key = postId ? `${endpoints.post.details}?id=${postId}` : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR<PostResponse>(key, fetcher, swrOptions);

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

export function useGetLatestPosts(title?: string) {
  const url = title ? [endpoints.post.latest, { params: { title } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<LatestPostsResponse>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      latestPosts: data?.latestPosts || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && !(data?.latestPosts?.length ?? 0),
    }),
    [data?.latestPosts, error, isLoading, isValidating],
  );

  return memoizedValue;
}

export function useSearchPosts(query?: string, dashboard: boolean = false) {
  const url = query ? [endpoints.post.search, { params: { query, dashboard } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SearchPostsResponse>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

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