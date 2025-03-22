import { paths } from "src/routes/paths";

import { CONFIG } from "src/config-global";

import { SvgColor } from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon("ic-job"),
  blog: icon("ic-blog"),
  chat: icon("ic-chat"),
  mail: icon("ic-mail"),
  user: icon("ic-user"),
  file: icon("ic-file"),
  lock: icon("ic-lock"),
  tour: icon("ic-tour"),
  order: icon("ic-order"),
  label: icon("ic-label"),
  blank: icon("ic-blank"),
  kanban: icon("ic-kanban"),
  folder: icon("ic-folder"),
  course: icon("ic-course"),
  banking: icon("ic-banking"),
  booking: icon("ic-booking"),
  invoice: icon("ic-invoice"),
  product: icon("ic-product"),
  calendar: icon("ic-calendar"),
  disabled: icon("ic-disabled"),
  external: icon("ic-external"),
  menuItem: icon("ic-menu-item"),
  ecommerce: icon("ic-ecommerce"),
  analytics: icon("ic-analytics"),
  dashboard: icon("ic-dashboard"),
  parameter: icon("ic-parameter"),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: "Обзор",
    items: [
      { title: "Главная", path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: "Аналитика", path: paths.dashboard.two, icon: ICONS.ecommerce },
      { title: "Отчеты", path: paths.dashboard.three, icon: ICONS.analytics },
    ],
  },
  /**
   * Management
   */
  {
    subheader: "Управление",
    items: [
      {
        title: "Пользователи",
        path: paths.dashboard.group.root,
        icon: ICONS.user,
        children: [
          { title: "Все пользователи", path: paths.dashboard.group.root },
          { title: "Активные", path: paths.dashboard.group.five },
          { title: "Заблокированные", path: paths.dashboard.group.six },
        ],
      },
    ],
  },
  {
    subheader: "Блог",
    items: [
      {
        title: "Статьи",
        path: paths.dashboard.post.root,
        icon: ICONS.blog,
        children: [
          { title: "Список", path: paths.dashboard.post.root },
          { title: "Создать", path: paths.dashboard.post.new },
        ],
      },
    ],
  },
];
