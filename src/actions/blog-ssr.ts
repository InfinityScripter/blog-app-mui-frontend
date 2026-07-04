// Note: Do not import SWR in SSR helpers to avoid RSC import issues

import type { Post, Comment, PublishStatus } from "src/types/domain";
import type {
  PostResponse,
  ReleaseResponse,
  ListPostsResponse,
  ListReleasesResponse,
  GenericMessageResponse,
} from "src/types/api";

import axios, { endpoints } from "src/utils/axios";
import { NEWS_TAG } from "src/sections/news/const";
import { fetchJsonWithRetry } from "src/utils/fetch-retry";

// ----------------------------------------------------------------------

// ISR window for the public blog SSR reads. Native fetch (not axios) is used
// here so Next can cache/revalidate these requests — axios bypasses the Next
// fetch cache, which would keep the pages dynamic.
//
// All reads go through fetchJsonWithRetry: transient backend failures (5xx,
// network) are retried with backoff instead of instantly failing a Vercel
// build or an ISR regeneration, while a genuine 404 throws NotFoundError for
// pages to map to notFound(). Callers must NOT swallow the remaining errors
// into empty lists/notFound — ISR would cache that for a whole revalidate
// window (the 2026-07-03 all-posts-404 incident).
const REVALIDATE_SECONDS = 3600;

const ISR_FETCH_INIT = { next: { revalidate: REVALIDATE_SECONDS } };

// The changelog is a release feed: new model releases (seeded, or published by
// the bot) should surface within minutes, not the 1h blog window — so its SSR
// reads get a shorter, dedicated revalidate window.
const CHANGELOG_REVALIDATE_SECONDS = 600;
const CHANGELOG_FETCH_INIT = {
  next: { revalidate: CHANGELOG_REVALIDATE_SECONDS },
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

export async function getPosts(): Promise<ListPostsResponse> {
  return fetchJsonWithRetry<ListPostsResponse>(
    `${SERVER_URL}${endpoints.post.list}`,
    ISR_FETCH_INIT,
  );
}

// ----------------------------------------------------------------------

/** Published posts tagged 'новости', for the /news feed (ISR-cached). */
export async function getNewsPosts(): Promise<ListPostsResponse> {
  const url = `${SERVER_URL}${endpoints.post.list}?tag=${encodeURIComponent(NEWS_TAG)}`;
  return fetchJsonWithRetry<ListPostsResponse>(url, ISR_FETCH_INIT);
}

// ----------------------------------------------------------------------

/**
 * Published posts for the blog list, EXCLUDING news (tag 'новости'). News lives
 * only in /news; the blog and home feed show authored/portfolio posts.
 */
export async function getBlogPosts(): Promise<ListPostsResponse> {
  const url = `${SERVER_URL}${endpoints.post.list}?excludeTag=${encodeURIComponent(NEWS_TAG)}`;
  return fetchJsonWithRetry<ListPostsResponse>(url, ISR_FETCH_INIT);
}

// ----------------------------------------------------------------------

/** Published posts carrying an exact tag, for the /tag/[slug] archive (ISR-cached). */
export async function getPostsByTag(tag: string): Promise<ListPostsResponse> {
  const url = `${SERVER_URL}${endpoints.post.list}?tag=${encodeURIComponent(tag)}`;
  return fetchJsonWithRetry<ListPostsResponse>(url, ISR_FETCH_INIT);
}

// ----------------------------------------------------------------------

export async function getPost(id: string): Promise<PostResponse> {
  return fetchJsonWithRetry<PostResponse>(
    `${SERVER_URL}${endpoints.post.details}?id=${id}`,
    ISR_FETCH_INIT,
  );
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

/**
 * All model releases for the /changelog archive (ISR-cached). The list route
 * returns BARE keys `{ releases, total }` (like `{ posts }`), so we read
 * `data.releases` directly.
 */
export async function getReleases(): Promise<ListReleasesResponse> {
  return fetchJsonWithRetry<ListReleasesResponse>(
    `${SERVER_URL}${endpoints.changelog.list}`,
    CHANGELOG_FETCH_INIT,
  );
}

// ----------------------------------------------------------------------

/**
 * A single model release by slug (ISR-cached). The detail route wraps its body
 * in `ok()` → `{ success, data: { release } }`, so the release is read from
 * `data.data.release` (NOT `data.release`).
 */
export async function getRelease(slug: string): Promise<ReleaseResponse> {
  const data = await fetchJsonWithRetry<{
    success: boolean;
    data: ReleaseResponse;
  }>(`${SERVER_URL}${endpoints.changelog.details(slug)}`, CHANGELOG_FETCH_INIT);
  return data.data;
}

// ----------------------------------------------------------------------

export async function createPost(
  postData: Partial<Post>,
): Promise<PostResponse> {
  const res = await axios.post<PostResponse>(endpoints.post.new, postData);
  return res.data;
}

export async function updatePost(
  postData: Partial<Post> & { id: string },
): Promise<PostResponse> {
  const res = await axios.put<PostResponse>(
    endpoints.post.edit(postData.id),
    postData,
  );
  return res.data;
}

export async function updatePostPublish(
  postId: string,
  publishStatus: PublishStatus,
): Promise<GenericMessageResponse> {
  try {
    const res = await axios.put<GenericMessageResponse>(
      endpoints.post.publish(postId),
      {
        publish: publishStatus,
      },
    );
    return res.data;
  } catch (error) {
    console.error("Ошибка обновления статуса публикации:", error);
    throw error;
  }
}

export async function deletePost(
  postId: string,
): Promise<GenericMessageResponse> {
  try {
    const res = await axios.delete<GenericMessageResponse>(
      endpoints.post.delete(postId),
    );
    return res.data;
  } catch (error) {
    console.error("Ошибка удаления поста:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<{
  user: import("src/types/domain").User;
}> {
  const res = await axios.get<{ user: import("src/types/domain").User }>(
    endpoints.auth.me,
  );
  return res.data;
}

export async function addComment(
  postId: string,
  commentData: Partial<Comment>,
): Promise<GenericMessageResponse> {
  if (!postId) {
    throw new Error("Post ID is required");
  }
  try {
    const res = await axios.post<GenericMessageResponse>(
      `${endpoints.post.comments.add(postId)}?postId=${postId}`,
      commentData,
    );
    return res.data;
  } catch (error) {
    console.error("Ошибка добавления комментария:", error);
    throw error;
  }
}

export async function updateComment(
  postId: string,
  commentId: string,
  commentData: Partial<Comment>,
): Promise<GenericMessageResponse> {
  const url = `${endpoints.post.comments.update(postId)}`;
  const res = await axios.put<GenericMessageResponse>(
    `${url}?postId=${postId}`,
    {
      commentId,
      ...commentData,
    },
  );
  return res.data;
}

export async function deleteComment(
  postId: string,
  commentId: string,
  options: Record<string, unknown> = {},
): Promise<GenericMessageResponse> {
  if (!postId || !commentId) {
    throw new Error("Post ID and Comment ID are required");
  }
  try {
    const url = `${endpoints.post.comments.delete(postId)}`;
    const res = await axios.delete<GenericMessageResponse>(
      `${url}?postId=${postId}`,
      {
        data: { commentId, ...options },
      },
    );
    return res.data;
  } catch (error) {
    console.error("Ошибка удаления комментария:", error);
    throw error;
  }
}
