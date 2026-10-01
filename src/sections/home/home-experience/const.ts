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
    position: "Frontend Developer",
    company: "QCup",
    location: "Санкт-Петербург",
    startDate: "2021-11-01",
    endDate: "2022-12-01",
    description: [
      "Спроектировал архитектуру приложения с нуля в трёхуровневой модели UI-BLL-DAL",
      "Реализовал клиент-серверное взаимодействие с REST API",
      "Выстроил обработку ошибок и состояния загрузки, повысив устойчивость UX",
      "Покрыл ключевые пользовательские сценарии переиспользуемыми компонентами",
    ],
    technologies:
      "JavaScript, TypeScript, React, Redux, Material UI, Git, HTML, CSS, Figma, REST API",
    logo: "/assets/icons/experience/qcup.svg",
    link: CONFIG.social.github,
  },
  {
    position: "Frontend Developer",
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
    position: "Full-stack Developer",
    company: "ShurikMarket",
    location: "Санкт-Петербург",
    startDate: "2022-11-01",
    endDate: "2024-05-01",
    description: [
      "Поддерживал монолит на Symfony и готовил его перевод на REST API",
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
    position: "Frontend Developer",
    company: "СТОМПЛАН",
    location: "Москва",
    startDate: "2024-05-01",
    endDate: "2025-04-01",
    description: [
      "Разработал сервис планирования стоматологического лечения и конструктор презентаций для пациентов с экспортом в PDF",
      "Руководил миграцией на современный Angular, спроектировал архитектуру навигации",
      "Спроектировал и внедрил интерактивные блоки контента",
      "Довёл продукт с нуля до запуска MVP",
    ],
    technologies:
      "JavaScript, TypeScript, Angular, Git, HTML, CSS, Figma, Webpack, REST API",
    logo: "/assets/icons/experience/stomplan.ico",
    link: "https://stomplan.ru",
  },
  {
    position: "Software Engineer, лид фронтенда платформы",
    company: "Яндекс Go",
    location: "Москва",
    startDate: "2025-04-01",
    endDate: null,
    description: [
      "Отвечаю за фронтенд low-code движка автоматизации (на Temporal, аналог n8n), который ежедневно запускает миллионы сценариев коммуникаций с клиентами; релиз в прод примерно раз в неделю и поддержка в проде",
      "Сделал LLM-функции в редакторе сценариев: шаг «AI-агент» с системным промптом и вызовом инструментов и генерацию целого сценария по промпту — от идеи с внутреннего хакатона до прода",
      "Встроил общий Email-сервис через Module Federation и перенёс настройку фильтров событий в платформу — это открыло новые запуски коммуникаций с измеримым эффектом на выручку",
      "Спроектировал и внедрил ролевую модель доступа: модель прав с бэкендом, слой API, блокировку действий, обработку 403 и шаринг доступа к сценариям, ботам и шаблонам",
      "Сделал версионирование и откат сценариев, новые каналы (Telegram, Viber, WhatsApp, Webhook, Push) и управление шаблонами",
      "Встроил админку AI-агентов соседней команды как iframe-модуль: 9 разделов, два репозитория, три недели",
      "Настроил RUM-мониторинг и пороги алертов; ревьюю ~50 PR за полугодие, декомпозирую и распределяю задачи на 3 разработчиков; внедрил AI-инструменты в команде и вёл внутренние спринты по AI-разработке",
    ],
    technologies:
      "TypeScript, React, Ant Design, TanStack Query, Module Federation, Temporal, LLM",
    logo: "/assets/icons/experience/yandex.png",
    link: "https://go.yandex",
  },
  {
    position: "Основатель, full-stack инженер",
    company: "aifirst.us.com",
    location: "Москва",
    startDate: "2025-01-01",
    endDate: null,
    description: [
      "AI-журнал на Next.js, React, Node.js и PostgreSQL: лента, поиск и редакционная CMS, ISR-кеширование, JWT-авторизация, unit- и e2e-тесты, свой деплой",
      "Автономный новостной агент на Node.js: собирает источники, ранжирует и пересказывает через LLM с маршрутизацией между провайдерами (Claude, OpenAI, локальные модели) ради баланса качества и цены; публикация после одобрения в Telegram",
      "Telegram-ассистент для AR-очков: фото или голос превращается через LLM в запись дневника питания во внешнем API (OAuth, очередь повторов); open-source приложение в строке меню macOS для Claude Code",
    ],
    technologies:
      "TypeScript, Next.js, React, Node.js, PostgreSQL, Claude API, OpenAI API, MCP",
    logo: "/favicon.ico",
    link: "https://aifirst.us.com",
  },
];
