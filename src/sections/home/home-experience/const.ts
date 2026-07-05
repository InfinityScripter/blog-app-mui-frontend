import { CONFIG } from "src/config-global";

import type { ExperienceItem } from "./types";

export const DATE_FORMAT = "MMMM YYYY";
// The «present» period word is UI copy → resolved via `home.experience.present`
// in the component and threaded into `getPeriodLabel` (not a static const).

export const EXPERIENCE: ExperienceItem[] = [
  {
    position: "IT Systems Implementation Specialist",
    company: "Газпром",
    location: "Санкт-Петербург",
    startDate: "2016-03-01",
    endDate: "2022-09-01",
    description: [
      "Внедрял и настраивал корпоративные IT-системы в продуктивную эксплуатацию",
      "Интегрировал системы документооборота со смежными корпоративными сервисами",
      "Обучал персонал работе с новыми IT-решениями и сопровождал внедрение",
      "Оптимизировал бизнес-процессы средствами IT-инструментов",
    ],
    technologies:
      "SAP, 1C, Microsoft SharePoint, SQL, Business Intelligence tools",
    logo: "/assets/icons/experience/gazprom.svg",
    link: "https://pererabotka.gazprom.ru",
  },
  {
    position: "Frontend Developer (React, TS)",
    company: "QCup",
    location: "Санкт-Петербург",
    startDate: "2022-11-01",
    endDate: "2023-05-01",
    description: [
      "Спроектировал архитектуру приложения с нуля в трёхуровневой модели UI-BLL-DAL",
      "Реализовал клиент-серверное взаимодействие с REST API",
      "Выстроил обработку ошибок и состояния загрузки, повысив устойчивость UX",
      "Покрыл ключевые пользовательские сценарии переиспользуемыми компонентами",
    ],
    technologies:
      "JavaScript, TypeScript, React, MUI UI, Git, HTML, CSS, Figma, REST API",
    logo: "/assets/icons/experience/qcup.svg",
    link: CONFIG.social.github,
  },
  {
    position: "Frontend Developer (JS)",
    company: "Яндекс",
    location: "Санкт-Петербург",
    startDate: "2023-05-01",
    endDate: "2023-10-01",
    description: [
      "Развивал UI-документацию Userver — ведущего C++ фреймворка Яндекса",
      "Улучшал документацию и кодовую базу фронтенда документации",
      "Перевёл интерфейс документации на новый UI-кит",
    ],
    technologies: "JavaScript, Git, HTML, CSS, Figma, jQuery",
    logo: "/assets/icons/experience/yandex.png",
    link: "https://userver.tech",
  },
  {
    position: "Frontend Developer (React, JS)",
    company: "ShurikMarket",
    location: "Санкт-Петербург",
    startDate: "2023-10-01",
    endDate: "2024-05-01",
    description: [
      "Ускорил первичную загрузку страниц, сократив время до интерактивности",
      "Разработал новые сервисы: новости, сертификаты, обратная связь, избранные товары",
      "Реализовал регистрацию и авторизацию пользователей end-to-end",
      "Сверстал новый лендинг по макетам в Pixel Perfect",
      "Внедрил внутренний UI-kit для унификации интерфейсов",
    ],
    technologies:
      "JavaScript, TypeScript, React JS, Next.js, Material UI, Git, HTML, CSS, Figma, Webpack, PHP, Twig, Symfony",
    logo: "/assets/icons/experience/shurikmarket.ico",
    link: "https://shurik.market",
  },
  {
    position: "Frontend Developer (Angular, TS)",
    company: "СТОМПЛАН",
    location: "Москва",
    startDate: "2024-05-01",
    endDate: "2025-04-01",
    description: [
      "Разработал мастер презентаций с экспортом в PDF",
      "Подготовил и провёл миграцию проекта на Angular",
      "Спроектировал и внедрил новые интерактивные блоки продукта",
      "Запустил продукт в MVP и довёл до релиза",
    ],
    technologies:
      "JavaScript, TypeScript, Angular, Git, HTML, CSS, Figma, Webpack, REST API",
    logo: "/assets/icons/experience/stomplan.ico",
    link: "https://stomplan.ru",
  },
  {
    position: "Frontend Developer (React, TS)",
    company: "Яндекс",
    location: "Москва",
    startDate: "2025-04-01",
    endDate: null,
    description: [
      "Спроектировал и разрабатываю внутренний low-code движок автоматизации бизнес-процессов (аналог n8n)",
      "Реализовал конструктор workflow-сценариев с интеграцией внешних API",
      "Построил интерфейсы управления триггерами, шагами и обработкой ошибок",
      "Оптимизировал UX и производительность для сценариев с большим числом узлов",
    ],
    technologies: "TypeScript, React, Ant Design",
    logo: "/assets/icons/experience/yandex.png",
    link: "https://yandex.ru",
  },
];
