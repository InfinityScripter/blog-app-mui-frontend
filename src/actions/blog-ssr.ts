// Note: Do not import SWR in SSR helpers to avoid RSC import issues

import axios, { endpoints } from "src/utils/axios";

import type { ListPostsResponse, PostResponse, LatestPostsResponse, GenericMessageResponse } from "src/types/api";
import type { Post, PublishStatus } from "src/types/domain";

// ----------------------------------------------------------------------

export async function getPosts(): Promise<ListPostsResponse> {
  const res = await axios.get<ListPostsResponse>(endpoints.post.list);

  return res.data;
}

// ----------------------------------------------------------------------

export async function getPost(id: string): Promise<PostResponse> {
  const res = await axios.get<PostResponse>(`${endpoints.post.details}?id=${id}`);
  return res.data;
}

// ----------------------------------------------------------------------

export async function getLatestPosts(id?: string): Promise<LatestPostsResponse> {
  const URL = id ? `${endpoints.post.latest}?id=${id}` : "";

  const res = await axios.get<LatestPostsResponse>(URL);

  return res.data;
}

export async function createPost(postData: Partial<Post>): Promise<PostResponse> {
  console.log(postData, "postData");
  const res = await axios.post<PostResponse>(endpoints.post.new, postData);
  return res.data;
}

export async function updatePost(postData: Partial<Post> & { id: string }): Promise<PostResponse> {
  const res = await axios.put<PostResponse>(`/api/post/${postData.id}/edit`, postData);
  return res.data;
}

export async function updatePostPublish(postId: string, publishStatus: PublishStatus): Promise<GenericMessageResponse> {
  try {
    const res = await axios.put<GenericMessageResponse>(`/api/post/${postId}/publish`, {
      publish: publishStatus,
    });
    return res.data;
  } catch (error) {
    console.error("Ошибка обновления статуса публикации:", error);
    throw error;
  }
}

export async function deletePost(postId: string): Promise<GenericMessageResponse> {
  try {
    // Если вы хотите использовать динамический URL с [id]:
    const res = await axios.delete<GenericMessageResponse>(`/api/post/${postId}/delete`);
    return res.data;
  } catch (error) {
    console.error("Ошибка удаления поста:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<{ user: import("src/types/domain").User }> {
  const res = await axios.get<{ user: import("src/types/domain").User }>("/api/auth/me");
  return res.data;
}

import type { Comment } from "src/types/domain";

export async function addComment(postId: string, commentData: Partial<Comment>): Promise<GenericMessageResponse> {
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

export async function updateComment(postId: string, commentId: string, commentData: Partial<Comment>): Promise<GenericMessageResponse> {
  const url = `${endpoints.post.comments.update(postId)}`;
  const res = await axios.put<GenericMessageResponse>(`${url}?postId=${postId}`, {
    commentId,
    ...commentData,
  });
  return res.data;
}

export async function deleteComment(postId: string, commentId: string, options: Record<string, unknown> = {}): Promise<GenericMessageResponse> {
  if (!postId || !commentId) {
    throw new Error("Post ID and Comment ID are required");
  }
  try {
    const url = `${endpoints.post.comments.delete(postId)}`;
    const res = await axios.delete<GenericMessageResponse>(`${url}?postId=${postId}`, {
      data: { commentId, ...options },
    });
    return res.data;
  } catch (error) {
    console.error("Ошибка удаления комментария:", error);
    throw error;
  }
}
