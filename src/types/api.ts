import type { Post } from './domain';

export interface ListPostsResponse {
  posts: Post[];
}

export interface PostResponse {
  post: Post;
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