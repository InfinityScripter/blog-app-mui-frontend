const ROOTS: { AUTH: string; DASHBOARD: string } = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

interface Paths {
  post: {
    root: string;
    details: (id: string) => string;
  };
  news: {
    root: string;
    details: (id: string) => string;
  };
  tag: {
    root: string;
    details: (tag: string) => string;
  };
  changelog: {
    root: string;
    details: (slug: string) => string;
  };
  llmTimeline: {
    root: string;
  };
  llmCompare: {
    root: string;
  };
  library: {
    root: string;
  };
  legal: {
    privacyPolicy: string;
    personalDataConsent: string;
  };
  auth: {
    jwt: {
      signIn: string;
      signUp: string;
    };
    resetPassword: string;
    updatePassword: string;
    verify: string;
    success: string;
    oauthConsent: string;
  };
  dashboard: {
    root: string;
    user: {
      account: string;
    };
    post: {
      root: string;
      new: string;
      details: (id: string) => string;
      edit: (id: string) => string;
    };
    admin: {
      users: string;
      posts: string;
      auditLogs: string;
      bot: string;
      llmStats: string;
      system: string;
      settings: string;
    };
  };
}

export const paths: Paths = {
  post: {
    root: `/post`,
    details: (id: string) => `/post/${id}`,
  },
  news: {
    root: `/news`,
    // News items are posts — the detail page is shared with /post/[id].
    details: (id: string) => `/post/${id}`,
  },
  tag: {
    root: `/tag`,
    // Backend tag matching is exact/case-sensitive — carry the raw tag through
    // the URL encoded (paramCase would strip Cyrillic to empty).
    details: (tag: string) => `/tag/${encodeURIComponent(tag)}`,
  },
  changelog: {
    root: `/changelog`,
    // Slugs are backend-generated (ascii-safe) but encode defensively so a
    // slug with unexpected characters can't break the URL.
    details: (slug: string) => `/changelog/${encodeURIComponent(slug)}`,
  },
  llmTimeline: {
    root: `/llm-timeline`,
  },
  llmCompare: {
    root: `/llm-compare`,
  },
  library: {
    root: `/library`,
  },
  legal: {
    privacyPolicy: "/privacy-policy",
    personalDataConsent: "/personal-data-consent",
  },
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    resetPassword: `${ROOTS.AUTH}/reset-password`,
    updatePassword: `${ROOTS.AUTH}/update-password`,
    verify: `${ROOTS.AUTH}/verify`,
    success: `${ROOTS.AUTH}/success`,
    oauthConsent: `${ROOTS.AUTH}/oauth-consent`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    user: {
      account: `${ROOTS.DASHBOARD}/user/account`,
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/post/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/post/${id}/edit`,
    },
    admin: {
      users: `${ROOTS.DASHBOARD}/admin/users`,
      posts: `${ROOTS.DASHBOARD}/admin/posts`,
      auditLogs: `${ROOTS.DASHBOARD}/admin/audit-logs`,
      bot: `${ROOTS.DASHBOARD}/admin/bot`,
      llmStats: `${ROOTS.DASHBOARD}/admin/llm-stats`,
      system: `${ROOTS.DASHBOARD}/admin/system`,
      settings: `${ROOTS.DASHBOARD}/admin/settings`,
    },
  },
};
