const ROOTS: { AUTH: string; DASHBOARD: string } = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

interface Paths {
  comingSoon: string;
  maintenance: string;
  pricing: string;
  payment: string;
  about: string;
  contact: string;
  page403: string;
  page404: string;
  page500: string;
  components: string;
  docs: string;
  changelog: string;
  zoneStore: string;
  minimalStore: string;
  freeUI: string;
  figma: string;
  post: {
    root: string;
    details: (id: string) => string;
  };
  news: {
    root: string;
    details: (id: string) => string;
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
    };
  };
}

export const paths: Paths = {
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  about: "/about-us",
  contact: "/contact-us",
  page403: "/error/403",
  page404: "/error/404",
  page500: "/error/500",
  components: "/components",
  docs: "https://docs.minimals.cc",
  changelog: "https://docs.minimals.cc/changelog",
  zoneStore: "https://mui.com/store/items/zone-landing-page/",
  minimalStore: "https://mui.com/store/items/minimal-dashboard/",
  freeUI: "https://mui.com/store/items/minimal-dashboard-free/",
  figma:
    "https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0",
  post: {
    root: `/post`,
    details: (id: string) => `/post/${id}`,
  },
  news: {
    root: `/news`,
    // News items are posts — the detail page is shared with /post/[id].
    details: (id: string) => `/post/${id}`,
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
    },
  },
};
