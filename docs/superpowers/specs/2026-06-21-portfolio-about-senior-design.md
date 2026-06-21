# Spec: Страница «Обо мне» — Software Engineer (senior redesign)

**Дата:** 2026-06-21
**Ветка:** `claude/romantic-carson-e1c555`
**Цель:** превратить страницу портфолио в зрелую инженерную презентацию, оптимизированную под то, что реально смотрят HR и ATS-системы.

## Контекст

Существующая страница `/portfolio` (`PortfolioView`) собрана из hero + переиспользуемых секций главной:
`PortfolioHero → HomeAbout → HomeSkills → HomeExperience → HomeProjects`.

Текущая роль везде — «Frontend разработчик» / «Web developer». Pet-проекты (погода, dashboard-туториал, блог-сам-на-себя) дают джуновый сигнал. Нет единого контакт-блока, нет кнопки скачать резюме, формулировки опыта — списки задач, не impact.

## Решения (зафиксированы с пользователем)

| Вопрос             | Решение                                                                        |
| ------------------ | ------------------------------------------------------------------------------ |
| Заголовок-роль     | **Software Engineer** (frontend/web focus в подзаголовке)                      |
| Объём              | Полный HR-пакет                                                                |
| Резюме             | Кнопка «Скачать резюме (PDF)»; файл-плейсхолдер сейчас, реальный PDF позже     |
| Статус доступности | Не показывать                                                                  |
| Projects блок      | Убрать полностью со страницы                                                   |
| Тон опыта          | Сильные формулировки, **строго на существующих фактах**, без выдуманных метрик |

## Целевая структура страницы

```
PortfolioHero    — Software Engineer + кнопка резюме + GitHub + метрики
HomeContact      — НОВЫЙ: Email · GitHub · LinkedIn · Telegram · гео
HomeAbout        — роль Software Engineer + переписанный текст
HomeSkills       — без изменений
HomeExperience   — квантифицированные формулировки
(HomeProjects)   — УБРАН со страницы
```

## Компоненты

### 1. PortfolioHero (`src/sections/portfolio/view/`)

- `Typography h1`: **Software Engineer** (gradient highlight оставить на части слова или на «Engineer»).
- Подзаголовок-lead: `Михаил Талалаев · Frontend / Web — React, Next.js, TypeScript` — ATS-ключевики на первом экране.
- CTA-кнопки:
  - primary: **Скачать резюме** (иконка `solar:download-minimalistic-bold` / `eva:download-fill`), `component="a"` `href={CV_URL}` `download`.
  - outlined: **GitHub** (как есть).
  - «Перейти к статьям» убрать из hero (страница больше не «про блог»).
- Метрики (`PORTFOLIO_METRICS` в `const.ts`):
  - `13+ лет` / «Опыт в IT»
  - `Software Engineer` / «Текущая роль» (или «Специализация»)
  - `React · Next.js` / «Основной стек»

### 2. HomeContact (НОВЫЙ — `src/sections/home/home-contact/`)

Файлы по гайдлайну секций: `home-contact.tsx`, `const.ts`, `types.ts`, `index.ts`.

- Заголовок секции: «Контакты» / «Связаться».
- Сетка карточек-ссылок (`Grid`, outlined `Paper`/`Card`), каждая — иконка + label + значение, кликабельна:
  - **Email** — `mailto:talalaev.misha@gmail.com`
  - **GitHub** — `https://github.com/InfinityScripter`
  - **LinkedIn** — `https://linkedin.com/in/talalaevs/`
  - **Telegram** — `https://t.me/sh0ny`
  - **Локация** — «Москва» (без ссылки, или просто текст-строка)
- Тип `ContactLink { icon; label; value; href?; external? }`.
- Стили через тему (`alpha`, palette), hover как в experience-карточках.
- `external` ссылки: `target="_blank" rel="noopener"`. `mailto`/локация — без target.

### 3. HomeAbout (`src/sections/home/home-about/const.ts`)

- `ABOUT_PROFILE.role`: `"Software Engineer"`.
- `ABOUT_TITLE`: оставить «Обо мне».
- `ABOUT_PARAGRAPHS` — переписать в инженерном тоне (3 абзаца):
  1. Кто: Software Engineer, 13+ лет в IT, полный цикл — от проектирования архитектуры до поставки в прод. Глубина во frontend (React, Next.js, Angular, TypeScript), уверенно в backend (Node.js, PostgreSQL) и DevOps (Docker, CI/CD).
  2. Где: Яндекс, СТОМПЛАН, ShurikMarket, QCup — разработка и оптимизация продуктов, внедрение функциональности, улучшение UX и производительности.
  3. Подход: проектирую системы с чёткими границами, беру задачи за пределами зоны комфорта, фокус на надёжность и измеримый результат для бизнеса.
- Без выдуманных цифр; «13+ лет» и компании — из существующих данных.

### 4. HomeExperience (`src/sections/home/home-experience/const.ts`)

Переписать `description[]` каждой позиции из «список задач» в impact-формат: **глагол действия в прош. времени + что сделал + контекст/эффект** — но **только на основе уже написанного**. Никаких процентов/чисел, которых нет в исходнике.

Примеры трансформации:

- «Ускорение первичной загрузки страницы сайта» → «Оптимизировал первичную загрузку страницы — сократил время до интерактивности».
- «Проработка архитектуры приложения с нуля» → «Спроектировал архитектуру приложения с нуля в трёхуровневой модели UI-BLL-DAL».
- «Настройка и разработка внутреннего аналога n8n…» → «Спроектировал и разработал внутренний low-code движок автоматизации (аналог n8n)…».

`position`, `company`, `technologies`, `logo`, `link`, даты — **не трогать** (фактические данные). Меняются только формулировки `description`.

Подзаголовок секции в `home-experience.tsx` («Мой профессиональный путь как веб-разработчика») — обновить на инженерный нейтральный («Мой профессиональный путь в разработке»).

### 5. PortfolioView (`src/sections/portfolio/view/portfolio-view.tsx`)

- Убрать `<HomeProjects />` и его импорт.
- Добавить `<HomeContact />` после `<PortfolioHero />`.
- Итог: `PortfolioHero → HomeContact → HomeAbout → HomeSkills → HomeExperience`.

### 6. Resume placeholder

- Каталог `public/assets/cv/`.
- Файл-плейсхолдер `mikhail-talalaev-cv.pdf` (валидный минимальный PDF, чтобы скачивание не отдавало 404/битый файл; пользователь заменит).
- Константы пути — в `src/sections/portfolio/view/const.ts`:
  - `CV_URL = "/assets/cv/mikhail-talalaev-cv.pdf"`
  - `CV_DOWNLOAD_NAME = "Mikhail-Talalaev-Software-Engineer.pdf"` (атрибут `download`).

## Мёртвый код / knip

`HomeProjects` снимается со страницы, но это единственное место использования. Проверить `npm run knip`:

- если `home-projects/*` становится unreachable и knip падает — удалить каталог `src/sections/home/home-projects/` целиком (компонент, const, types, index), т.к. секции `sections/` не переиспользуются между собой и блок больше не нужен. Решение принимается по факту вывода knip.

## Стиль / архитектурные правила (из CLAUDE.md)

- kebab-case файлы, MUI `sx`, без CSS-Modules, без PascalCase-массового ренейма.
- Без `for-of`/`while` (es5 target + Airbnb) — только функциональные методы массивов.
- Без `as`/`any`; строковые параметры — юнионы.
- Статика и типы — рядом с компонентом (`const.ts`/`types.ts`).
- Рамки/hover/текст — через палитру темы (`alpha`, `theme.palette`), без хардкода цветов.
- Формы — RHF (здесь форм нет, не релевантно).

## Верификация

1. `npm run lint` — 0 ошибок.
2. `npx tsc --noEmit` (или `npm run build`-уровень типов) — 0 ошибок.
3. `npm run knip` — 0 (или осознанно почистить удалённый Projects).
4. Dev-сервер в worktree (порт 3055, без `--turbo`, см. memory `worktree-preview-env-trap`) → открыть `/portfolio` → скриншот light+dark → проверить: заголовок Software Engineer, кнопка резюме скачивает PDF, контакт-ссылки кликабельны, Projects отсутствует.

## Out of scope

- Backend, тема, роутинг, главная страница (`page.tsx`).
- Реальный текст PDF-резюме (пользователь предоставит файл).
- Skills блок — не трогаем.
