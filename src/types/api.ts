import type { Post } from './domain';

export interface ListPostsResponse {
  posts: Post[];
  /** Present only when the caller passes ?page/?limit; unbounded reads omit these. */
  total?: number;
  hasMore?: boolean;
}

export interface PostResponse {
  post: Post;
  latestPosts?: Post[];
}

export interface LatestPostsResponse {
  latestPosts: Post[];
}

export interface GenericMessageResponse {
  message: string;
}

export interface SearchPostsResponse {
  results: Post[];
} 