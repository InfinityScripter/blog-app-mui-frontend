import type { ExperienceItem } from "./types";

export const EXPERIENCE: ExperienceItem[] = [
  {
    position: "IT Systems Implementation Specialist",
    company: "Газпром",
    location: "Санкт-Петербург",
    startDate: "2016-03-01",
    endDate: "2022-09-01",
    description: [
      "Внедрение и настройка корпоративных IT-систем",
      "Интеграция систем документооборота",
      "Обучение персонала работе с новыми IT-решениями",
      "Оптимизация бизнес-процессов с использованием IT-инструментов",
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
      "Проработка архитектуры приложения с нуля",
      "Разработка клиент-серверных взаимодействий",
      "Реализация приложения в рамках трёхуровневой архитектуры UI-BLL-DAL",
      "Обработка ошибок и внедрение прелоадеров для улучшения UX",
    ],
    technologies:
      "JavaScript, TypeScript, React, MUI UI, Git, HTML, CSS, Figma, REST API",
    logo: "/assets/icons/experience/qcup.svg",
    link: "https://github.com/InfinityScripter",
  },
  {
    position: "Frontend Developer (JS)",
    company: "Яндекс",
    location: "Санкт-Петербург",
    startDate: "2023-05-01",
    endDate: "2023-10-01",
    description: [
      "Оптимизация UI-документации для Userver, ведущего C++ фреймворка",
      "Улучшение документации и кодовой базы",
      "Перевод на новый UI-кит",
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
      "Ускорение первичной загрузки страницы сайта",
      "Разработка новых сервисов (новости, сертификаты, обратная связь, избранные товары)",
      "Разработка и внедрение функционала регистрации и авторизации пользователей",
      "Вёрстка нового лендинга по макетам Pixel Perfect",
      "Внедрение внутреннего UI kit",
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
      "Разработка мастера презентаций с возможностью выгрузки в PDF",
      "Подготовка проекта к переходу на Angular",
      "Внедрение новых интерактивных блоков",
      "Успешный старт и запуск продукта в MVP",
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
      "Настройка и разработка внутреннего аналога n8n для автоматизации бизнес-процессов",
      "Реализация конструктора workflow-сценариев с интеграцией внешних API",
      "Разработка интерфейсов для управления триггерами, шагами и обработкой ошибок",
      "Оптимизация UX и производительности в сценариях с большим числом узлов",
    ],
    technologies: "TypeScript, React, Ant Design",
    logo: "/assets/icons/experience/yandex.png",
    link: "https://yandex.ru",
  },
];
