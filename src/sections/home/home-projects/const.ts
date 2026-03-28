import type { HomeProject } from "./types";

export const PROJECTS: HomeProject[] = [
  {
    title: "Блог-платформа",
    description:
      "Полнофункциональная блог-платформа с компонентами Material UI, аутентификацией пользователей и адаптивным дизайном.",
    icon: "mdi:blog",
    iconColor: "primary.main",
    link: "https://github.com/InfinityScripter/blog-app-mui-frontend",
    demoLink: "https://sh0ny.ru/post",
    tech: ["React", "Material UI", "Node.js"],
    features: [
      "Аутентификация пользователей",
      "Адаптивный дизайн",
      "Управление постами",
      "Компоненты Material UI",
    ],
  },
  {
    title: "Погодное приложение",
    description:
      "Интерактивное погодное приложение с данными о погоде в реальном времени, прогнозами и поиском по местоположению.",
    icon: "mdi:weather-partly-cloudy",
    iconColor: "primary.main",
    link: "https://github.com/InfinityScripter/weather-app",
    demoLink: "https://weather-app-blue-nine-95.vercel.app/",
    tech: ["React", "Weather API", "CSS"],
    features: [
      "Данные о погоде в реальном времени",
      "Поиск по местоположению",
      "Визуализация прогноза",
      "Адаптивный дизайн",
    ],
  },
  {
    title: "Панель управления Next.js",
    description:
      "Современная панель администратора, созданная с использованием Next.js, с аналитикой, управлением пользователями и визуализацией данных.",
    icon: "mdi:chart-box",
    iconColor: "primary.main",
    link: "https://github.com/InfinityScripter/dashboard-next-js",
    demoLink: "https://dashboard-plum-zeta-47.vercel.app/",
    tech: ["Next.js", "Material UI", "Chart.js"],
    features: [
      "Визуализация данных",
      "Управление пользователями",
      "Аналитическая панель",
      "Темная/Светлая тема",
    ],
  },
];
