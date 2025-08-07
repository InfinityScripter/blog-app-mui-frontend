import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(new Error('Something went wrong. Please try again.'));
  },
);

export default axiosInstance;

export type FetcherArgs = string | [string, AxiosRequestConfig];

export const fetcher = async <T = unknown>(args: FetcherArgs): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, undefined];
    const res = await axiosInstance.get<T>(url, { ...(config as AxiosRequestConfig) });
    return res.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch:', error);
    throw error;
  }
};

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
      list: (postId: string) => `/api/post/${postId}/comments`,
      add: (postId: string) => `/api/post/${postId}/comments`,
      update: (postId: string) => `/api/post/${postId}/comments`,
      delete: (postId: string) => `/api/post/${postId}/comments`,
      reply: (postId: string, commentId: string) => `/api/post/${postId}/comments/${commentId}/reply`,
    },
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
} as const; 