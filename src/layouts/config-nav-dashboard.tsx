import { paths } from "src/routes/paths";
import { CONFIG } from "src/config-global";
import { SvgColor } from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  blog: icon("ic-blog"),
  user: icon("ic-user"),
  dashboard: icon("ic-dashboard"),
};

// ----------------------------------------------------------------------

export function getNavData(role?: string) {
  const baseNav = [
    {
      subheader: "Обзор",
      items: [
        { title: "Главная", path: paths.dashboard.root, icon: ICONS.dashboard },
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

  if (role === "admin") {
    baseNav.push({
      subheader: "Администрирование",
      items: [
        {
          title: "Пользователи",
          path: paths.dashboard.admin.users,
          icon: ICONS.user,
        },
        {
          title: "Все посты",
          path: paths.dashboard.admin.posts,
          icon: ICONS.blog,
        },
        {
          title: "Журнал аудита",
          path: paths.dashboard.admin.auditLogs,
          icon: ICONS.dashboard,
        },
        {
          title: "AI-бот",
          path: paths.dashboard.admin.bot,
          icon: ICONS.dashboard,
        },
        {
          title: "Статистика LLM",
          path: paths.dashboard.admin.llmStats,
          icon: ICONS.dashboard,
        },
        {
          title: "Сервер",
          path: paths.dashboard.admin.system,
          icon: ICONS.dashboard,
        },
        {
          title: "Настройки",
          path: paths.dashboard.admin.settings,
          icon: ICONS.dashboard,
        },
      ],
    });
  }

  return baseNav;
}
