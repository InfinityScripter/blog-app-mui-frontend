import { mutate } from "swr";

import axios, { endpoints } from 'src/utils/axios';

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
  const URL = id ? `${endpoints.post.latest}?id=${id}` : '';

  const res = await axios.get(URL);

  return res.data;
}

export async function createPost(postData) {
  console.log(postData, 'postData');
  const res = await axios.post(endpoints.post.new, postData);
  return res.data;
}

export async function updatePost(postData) {
  const res = await axios.put(`/api/post/${postData.id}/edit`, postData);
  await mutate(endpoints.post.list);
  return res.data;
}

export async function updatePostPublish(postId, publishStatus) {
  try {
    const res = await axios.put(`/api/post/${postId}/publish`, { publish: publishStatus });
    await mutate(endpoints.post.list);
    return res.data;
  } catch (error) {
    console.error('Ошибка обновления статуса публикации:', error);
    throw error;
  }
}

export async function deletePost(postId) {
  try {
    // Если вы хотите использовать динамический URL с [id]:
    const res = await axios.delete(`/api/post/${postId}/delete`);
    await mutate(endpoints.post.list);
    return res.data;
  } catch (error) {
    console.error('Ошибка удаления поста:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  const res = await axios.get('/api/auth/me');
  return res.data;
}

export async function addComment(postId, commentData) {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  try {
    const res = await axios.post(`${endpoints.post.comments.add(postId)}?postId=${postId}`, commentData);
    // Инвалидируем кэш для обновления данных
    await mutate(`${endpoints.post.details}?id=${postId}`);
    return res.data;
  } catch (error) {
    console.error('Ошибка добавления комментария:', error);
    throw error;
  }
}

export async function updateComment(postId, commentId, commentData) {
  if (!postId || !commentId) {
    throw new Error('Post ID and Comment ID are required');
  }
  try {
    const res = await axios.put(`${endpoints.post.comments.update(postId, commentId)}?postId=${postId}`, commentData);
    await mutate(`${endpoints.post.details}?id=${postId}`);
    return res.data;
  } catch (error) {
    console.error('Ошибка обновления комментария:', error);
    throw error;
  }
}

export async function deleteComment(postId, commentId, options = {}) {
  if (!postId || !commentId) {
    throw new Error('Post ID and Comment ID are required');
  }
  try {
    const res = await axios.delete(`${endpoints.post.comments.delete(postId, commentId)}?postId=${postId}`, { data: options });
    await mutate(`${endpoints.post.details}?id=${postId}`);
    return res.data;
  } catch (error) {
    console.error('Ошибка удаления комментария:', error);
    throw error;
  }
}
