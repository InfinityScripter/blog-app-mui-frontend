// Note: Do not import SWR in SSR helpers to avoid RSC import issues

import type { Post, Comment, PublishStatus } from "src/types/domain";
import type {
  PostResponse,
  ListPostsResponse,
  LatestPostsResponse,
  GenericMessageResponse,
} from "src/types/api";

import axios, { endpoints } from "src/utils/axios";
import { NEWS_TAG } from "src/sections/news/const";

// ----------------------------------------------------------------------

// ISR window for the public blog SSR reads. Native fetch (not axios) is used
// here so Next can cache/revalidate these requests — axios bypasses the Next
// fetch cache, which would keep the pages dynamic.
const REVALIDATE_SECONDS = 3600;

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

export async function getPosts(): Promise<ListPostsResponse> {
  const res = await fetch(`${SERVER_URL}${endpoints.post.list}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }
  const data: ListPostsResponse = await res.json();
  return data;
}

// ----------------------------------------------------------------------

/** Published posts tagged 'новости', for the /news feed (ISR-cached). */
export async function getNewsPosts(): Promise<ListPostsResponse> {
  const url = `${SERVER_URL}${endpoints.post.list}?tag=${encodeURIComponent(NEWS_TAG)}`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) {
    throw new Error(`Failed to fetch news posts: ${res.status}`);
  }
  const data: ListPostsResponse = await res.json();
  return data;
}

// ----------------------------------------------------------------------

export async function getPost(id: string): Promise<PostResponse> {
  const res = await fetch(`${SERVER_URL}${endpoints.post.details}?id=${id}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch post ${id}: ${res.status}`);
  }
  const data: PostResponse = await res.json();
  return data;
}

// ----------------------------------------------------------------------

export async function getLatestPosts(
  id?: string,
): Promise<LatestPostsResponse> {
  const URL = id ? `${endpoints.post.latest}?id=${id}` : "";

  const res = await axios.get<LatestPostsResponse>(URL);

  return res.data;
}

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
    `/api/post/${postData.id}/edit`,
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
      `/api/post/${postId}/publish`,
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
    // Если вы хотите использовать динамический URL с [id]:
    const res = await axios.delete<GenericMessageResponse>(
      `/api/post/${postId}/delete`,
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
    "/api/auth/me",
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
