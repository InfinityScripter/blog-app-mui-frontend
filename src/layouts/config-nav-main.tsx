import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export const navData = [
  {
    title: "Главная",
    path: "/",
    icon: <Iconify width={22} icon="solar:home-2-bold-duotone" />,
  },
  {
    title: "Новости",
    path: "/news",
    icon: <Iconify width={22} icon="solar:notebook-bold-duotone" />,
  },
  {
    title: "Блог",
    path: "/post",
    icon: <Iconify width={22} icon="solar:file-bold-duotone" />,
  },
  {
    title: "Релизы",
    path: "/changelog",
    icon: <Iconify width={22} icon="solar:rocket-2-bold-duotone" />,
  },
  {
    title: "История LLM",
    path: "/llm-timeline",
    icon: <Iconify width={22} icon="solar:clock-circle-bold-duotone" />,
  },
  {
    title: "Сравнение LLM",
    path: "/llm-compare",
    icon: <Iconify width={22} icon="solar:ranking-bold-duotone" />,
  },
  {
    title: "Библиотека",
    path: "/library",
    icon: <Iconify width={22} icon="solar:bookmark-square-bold-duotone" />,
  },
  {
    title: "Обо мне",
    path: "/portfolio",
    icon: <Iconify width={22} icon="solar:user-circle-bold-duotone" />,
  },
];
