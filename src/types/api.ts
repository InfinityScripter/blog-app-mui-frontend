import type { Post } from "./domain";

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

export interface GenericMessageResponse {
  message: string;
}

export interface SearchPostsResponse {
  results: Post[];
}

// ----------------------------------------------------------------------
// Model release changelog (§3 frozen contract — shared across backend/bot/FE).

export interface ModelRelease {
  id: string;
  slug: string;
  vendor: string;
  model: string;
  version: string;
  /** ISO string (TIMESTAMPTZ -> string). */
  releasedAt: string;
  /** NEVER invented — null if unknown. */
  contextTokens: number | null;
  /** $/1M tokens, null if unknown. */
  priceIn: number | null;
  priceOut: number | null;
  /** Defaults []. */
  changes: string[];
  /** Owner one-liner; null on bot drafts. */
  verdict: string | null;
  sourceUrl: string;
  sourceName: string | null;
  createdAt: string;
  updatedAt: string;
}

/** GET /api/changelog/list — bare keys, like { posts }. */
export interface ListReleasesResponse {
  releases: ModelRelease[];
  total: number;
}

/** Payload nested under ok() → data for GET [slug] and POST new. */
export interface ReleaseResponse {
  release: ModelRelease;
}
