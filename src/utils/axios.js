import axios from 'axios';


// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_SERVER_URL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(new Error('Something went wrong. Please try again.'));
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    verify: '/api/auth/verify',
    resendVerification: '/api/auth/resend-verification',
    resetPassword: '/api/auth/reset-password',
    updatePassword: '/api/auth/update-password',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
    new: '/api/post/new',
    edit: '/api/post/edit',
    comments: {
      list: (postId) => `/api/post/${postId}/comments`,
      add: (postId) => `/api/post/${postId}/comments`,
      update: (postId) => `/api/post/${postId}/comments`,
      delete: (postId) => `/api/post/${postId}/comments`,
      reply: (postId, commentId) => `/api/post/${postId}/comments/${commentId}/reply`,
    },
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
