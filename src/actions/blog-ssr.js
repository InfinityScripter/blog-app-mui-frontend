import {mutate} from "swr";

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
