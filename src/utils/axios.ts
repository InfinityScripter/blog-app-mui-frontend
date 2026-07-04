import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(new Error("Something went wrong. Please try again."));
  },
);

export default axiosInstance;

export type FetcherArgs = string | [string, AxiosRequestConfig];

export const fetcher = async <T = unknown>(args: FetcherArgs): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, undefined];
    const res = await axiosInstance.get<T>(url, {
      ...config,
    });
    return res.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch:", error);
    throw error;
  }
};

export const endpoints = {
  auth: {
    me: "/api/auth/me",
    signIn: "/api/auth/sign-in",
    signUp: "/api/auth/sign-up",
    google: "/api/auth/google",
    yandex: "/api/auth/yandex",
    verify: "/api/auth/verify",
    resendVerification: "/api/auth/resend-verification",
    resetPassword: "/api/auth/reset-password",
    updatePassword: "/api/auth/update-password",
  },
  post: {
    list: "/api/post/list",
    details: "/api/post/details",
    latest: "/api/post/latest",
    search: "/api/post/search",
    new: "/api/post/new",
    edit: (postId: string) => `/api/post/${postId}/edit`,
    publish: (postId: string) => `/api/post/${postId}/publish`,
    delete: (postId: string) => `/api/post/${postId}/delete`,
    view: (postId: string) => `/api/post/${postId}/view`,
    comments: {
      list: (postId: string) => `/api/post/${postId}/comments`,
      add: (postId: string) => `/api/post/${postId}/comments`,
      update: (postId: string) => `/api/post/${postId}/comments`,
      delete: (postId: string) => `/api/post/${postId}/comments`,
    },
  },
  changelog: {
    list: "/api/changelog/list",
    details: (slug: string) => `/api/changelog/${encodeURIComponent(slug)}`,
  },
  newsletter: {
    subscribe: "/api/newsletter/subscribe",
    confirm: "/api/newsletter/confirm",
    unsubscribe: "/api/newsletter/unsubscribe",
  },
  admin: {
    users: "/api/admin/users",
    userById: (id: string) => `/api/admin/users/${id}`,
    postById: (id: string) => `/api/admin/posts/${id}`,
    auditLogs: "/api/admin/audit-logs",
    systemMetrics: "/api/admin/system-metrics",
    bot: {
      status: "/api/admin/bot/status",
      providers: "/api/admin/bot/providers",
      models: (provider: string) =>
        `/api/admin/bot/models?provider=${provider}`,
      model: "/api/admin/bot/model",
      mock: "/api/admin/bot/mock",
      modelsHealth: "/api/admin/bot/models-health",
    },
    llmStats: {
      snapshot: "/api/admin/llm-stats/snapshot",
    },
  },
  user: {
    profile: "/api/user/profile",
    avatar: "/api/user/avatar",
    changePassword: "/api/user/change-password",
  },
  upload: "/api/upload",
};
