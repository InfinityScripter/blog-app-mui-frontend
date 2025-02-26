// ----------------------------------------------------------------------

import { _id, _postTitles } from 'src/_mock/assets';



const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  post: {
    root: `/post`,
    details: (id) => `/post/${id}`,
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
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (id) => `${ROOTS.DASHBOARD}/post/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/post/${id}/edit`,
    },
  },
};
