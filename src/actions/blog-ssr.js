// Note: Do not import SWR in SSR helpers to avoid RSC import issues

import axios, { endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------

export async function getPosts() {
  const res = await axios.get(endpoints.post.list);

  return res.data;
}

// ----------------------------------------------------------------------

export async function getPost(id) {
  const res = await axios.get(`${endpoints.post.details}?id=${id}`);
  return res.data;
}

// ----------------------------------------------------------------------

export async function getLatestPosts(id) {
  const URL = id ? `${endpoints.post.latest}?id=${id}` : "";

  const res = await axios.get(URL);

  return res.data;
}

export async function createPost(postData) {
  console.log(postData, "postData");
  const res = await axios.post(endpoints.post.new, postData);
  return res.data;
}

export async function updatePost(postData) {
  const res = await axios.put(`/api/post/${postData.id}/edit`, postData);
  return res.data;
}

export async function updatePostPublish(postId, publishStatus) {
  try {
    const res = await axios.put(`/api/post/${postId}/publish`, {
      publish: publishStatus,
    });
    return res.data;
  } catch (error) {
    console.error("Ошибка обновления статуса публикации:", error);
    throw error;
  }
}

export async function deletePost(postId) {
  try {
    // Если вы хотите использовать динамический URL с [id]:
    const res = await axios.delete(`/api/post/${postId}/delete`);
    return res.data;
  } catch (error) {
    console.error("Ошибка удаления поста:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  const res = await axios.get("/api/auth/me");
  return res.data;
}

export async function addComment(postId, commentData) {
  if (!postId) {
    throw new Error("Post ID is required");
  }
  try {
    const res = await axios.post(
      `${endpoints.post.comments.add(postId)}?postId=${postId}`,
      commentData,
    );
    return res.data;
  } catch (error) {
    console.error("Ошибка добавления комментария:", error);
    throw error;
  }
}

export async function updateComment(postId, commentId, commentData) {
  const url = `${endpoints.post.comments.update(postId)}`;
  const res = await axios.put(`${url}?postId=${postId}`, {
    commentId,
    ...commentData,
  });
  return res.data;
}

export async function deleteComment(postId, commentId, options = {}) {
  if (!postId || !commentId) {
    throw new Error("Post ID and Comment ID are required");
  }
  try {
    const url = `${endpoints.post.comments.delete(postId)}`;
    const res = await axios.delete(`${url}?postId=${postId}`, {
      data: { commentId, ...options },
    });
    return res.data;
  } catch (error) {
    console.error("Ошибка удаления комментария:", error);
    throw error;
  }
}
