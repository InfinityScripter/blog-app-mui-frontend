import axios from 'axios';


// ----------------------------------------------------------------------

// Determine if we're running on Vercel by checking the hostname
const isVercelEnvironment = typeof window !== 'undefined' &&
  (window.location.hostname.includes('onrender.com') ||
   window.location.hostname.includes('blog-app-mui-frontend'));

// Set the correct baseURL based on the environment
const baseURL = isVercelEnvironment
  ? 'https://blog-app-mui-backend.onrender.com'
  : process.env.NEXT_PUBLIC_SERVER_URL;

const axiosInstance = axios.create({
  baseURL,
});

// For debugging
if (typeof window !== 'undefined') {
  console.log('Current hostname:', window.location.hostname);
  console.log('Is Vercel environment:', isVercelEnvironment);
  console.log('Using baseURL:', baseURL);
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error:', error);
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(new Error('Что-то пошло не так. Попробуйте снова.'));
  }
);

export default axiosInstance;
console.log('NEXT_PUBLIC_SERVER_URL:', process.env.NEXT_PUBLIC_SERVER_URL);

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
