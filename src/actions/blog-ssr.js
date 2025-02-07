import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function getPosts() {
  const res = await axios.get(endpoints.post.list);

  return res.data;
}

// ----------------------------------------------------------------------

export async function getPost(title) {
  const URL = title ? `${endpoints.post.details}?title=${title}` : '';

  const res = await axios.get(URL);

  return res.data;
}

// ----------------------------------------------------------------------

export async function getLatestPosts(title) {
  const URL = title ? `${endpoints.post.latest}?title=${title}` : '';

  const res = await axios.get(URL);

  return res.data;
}

export async function createPost(postData) {
  console.log(postData, 'postData');
  const res = await axios.post(endpoints.post.new, postData);
  return res.data;
}

export async function updatePost(postData) {
  const res = await axios.put(endpoints.post.edit, postData);
  return res.data;
}
