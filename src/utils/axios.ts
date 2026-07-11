import { emitSessionExpired } from "src/auth/context/jwt/session-events";
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";

import {
  isMutatingMethod,
  CSRF_COOKIE_NAME,
  readBrowserCookie,
} from "./csrf-cookie";

// Auth now rides in httpOnly cookies, so every request must send credentials.
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});

// Endpoints that must never trigger the 401→refresh→retry loop (they ARE the
// auth handshake; a 401 from them is terminal).
const AUTH_BYPASS_PATHS = ["/api/auth/refresh", "/api/auth/sign-in"];

const REFRESH_PATH = "/api/auth/refresh";

// Carry a "retried once" marker on the request config via declaration merging
// (the repo forbids `as` casts — augment the type instead of asserting it).
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retriedAfterRefresh?: boolean;
  }
}

// Attach the double-submit CSRF header on mutating requests.
axiosInstance.interceptors.request.use((config) => {
  if (isMutatingMethod(config.method)) {
    const csrf = readBrowserCookie(CSRF_COOKIE_NAME);
    if (csrf) {
      config.headers.set("X-CSRF-Token", csrf);
    }
  }
  return config;
});

// Single-flight refresh: concurrent 401s share one refresh request.
let refreshPromise: Promise<boolean> | null = null;

async function runRefresh(): Promise<boolean> {
  try {
    await axiosInstance.post(REFRESH_PATH);
    return true;
  } catch {
    return false;
  }
}

function toError(error: AxiosError<{ message?: string }>): Error {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  // No backend message — keep the axios context ("Network Error", "Request
  // failed with status code 500") instead of one generic string, so logs and
  // toasts can distinguish offline / server / client failures.
  if (error.message) {
    return new Error(error.message);
  }
  return new Error("Something went wrong. Please try again.");
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const { config } = error;
    const status = error.response?.status;
    const url = config?.url ?? "";
    // Anchored match (not includes): a future endpoint that merely contains a
    // bypass path as a substring must not silently skip the refresh loop.
    const isBypass = AUTH_BYPASS_PATHS.some(
      (path) => url === path || url.startsWith(`${path}?`),
    );

    // A 401 on a normal request → try one silent refresh, then replay it.
    if (status === 401 && config && !config._retriedAfterRefresh && !isBypass) {
      config._retriedAfterRefresh = true;
      if (!refreshPromise) {
        // Reset via finally AT CREATION, not after each awaiter's own await:
        // a 401 arriving between one awaiter's resolution and its manual reset
        // would otherwise start a second refresh mid-burst — with rotating
        // refresh tokens that second call can invalidate the first and sign
        // the user out.
        refreshPromise = runRefresh().finally(() => {
          refreshPromise = null;
        });
      }
      const refreshed = await refreshPromise;

      if (refreshed) {
        return axiosInstance(config);
      }
      // Refresh failed → the session is over; let the app sign the user out.
      emitSessionExpired();
    }

    return Promise.reject(toError(error));
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
    signOut: "/api/auth/sign-out",
    signOutAll: "/api/auth/sign-out-all",
    refresh: "/api/auth/refresh",
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
  llmStats: {
    public: "/api/llm-stats/public",
  },
  upload: "/api/upload",
};
