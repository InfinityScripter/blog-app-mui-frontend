# blog-app-mui-frontend

Фронтенд блога **[aifirst.us.com](https://aifirst.us.com)** — русскоязычный блог про AI/LLM/агентов: посты, новостная лента, changelog релизов моделей, таймлайн LLM и портфолио автора.

**Стек:** Next.js 15 (App Router) · React 19 · MUI v7 · SWR · React Hook Form + Zod · Tiptap. Бэкенд — отдельный репозиторий `blog-app-mui-backend` (Next.js API + PostgreSQL, порт 7272).

---

## Быстрый старт

Требования: Node.js 20, запущенный бэкенд на `http://localhost:7272`.

```sh
yarn install          # менеджер пакетов — yarn (yarn.lock — единственный lockfile)
cp .env.example .env.local
yarn dev              # http://localhost:3033
```

Переменные окружения (билд-тайм, префикс `NEXT_PUBLIC_`, читаются через `process.env`):

| Переменная                                      | Что делает                                   | Локальное значение      |
| ----------------------------------------------- | -------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_SERVER_URL`                        | Базовый URL API-бэкенда (axios + SSR-фетчи)  | `http://localhost:7272` |
| `NEXT_PUBLIC_ASSET_URL`                         | Хост файлов/картинок (загрузки, сид-обложки) | `http://localhost:7272` |
| `NEXT_PUBLIC_BASE_PATH`                         | basePath, если сайт живёт в подкаталоге      | пусто                   |
| `NEXT_PUBLIC_{GOOGLE,YANDEX,BING}_VERIFICATION` | токены подтверждения прав в вебмастерах      | пусто                   |

## Скрипты

| Команда                         | Что делает                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| `yarn dev`                      | dev-сервер на 3033 (`next dev --turbo`)                                              |
| `yarn build` / `yarn start`     | production-сборка / запуск сборки на 3033                                            |
| `yarn lint` / `yarn lint:fix`   | ESLint (0 ошибок и 0 предупреждений — норма)                                         |
| `yarn fm:check` / `yarn fm:fix` | Prettier                                                                             |
| `npx tsc --noEmit`              | проверка типов                                                                       |
| `yarn test:unit` (`:watch`)     | Vitest — юнит-тесты утилит и серверной логики                                        |
| `yarn e2e` / `yarn e2e:ui`      | Playwright (порт 3055, нужен бэкенд на 7272)                                         |
| `yarn knip`                     | мёртвые файлы/экспорты/зависимости (норма — 0)                                       |
| `yarn analyze`                  | сборка с bundle-analyzer                                                             |
| `yarn llm-stats:push`           | пуш локальной статистики LLM-харнессов в админ-дашборд (`scripts/push-llm-stats.ts`) |

## Структура проекта

```
src/
├── app/            # App Router: страницы, layouts, метаданные, feed.xml, /api/revalidate
├── sections/       # Компоненты уровня страницы (изолированы: секция ≠ импортирует секцию)
├── components/     # Переиспользуемый UI (hook-form, iconify, markdown, snackbar, editor…)
├── layouts/        # Каркасы: main (публичный сайт), dashboard, auth-split, simple
├── actions/        # Слой данных: SWR-хуки (клиент) + SSR-фетчеры (blog-ssr.ts)
├── auth/           # JWT-контекст, guard'ы (AuthGuard / GuestGuard / RoleBasedGuard)
├── theme/          # Тема MUI v7 (Editorial Ink): палитра, типографика, оверрайды
├── routes/         # paths.ts (все URL) + hooks (обёртки next/navigation)
├── server/         # Серверный код вне React: llm-stats (SQLite-агрегация)
├── utils/          # axios + endpoints, форматтеры, retry-фетч, cover-src
├── hooks/          # Глобальные хуки (use-boolean, use-debounce, use-set-state…)
├── types/          # Доменные типы (Post, User) и контракты API (api.ts)
├── assets/         # Локальные SVG-иконки/иллюстрации как React-компоненты
├── config-global.ts# CONFIG: имя сайта, URL, соцсети, auth-метод (jwt)
└── global.css      # Глобальные стили + секционные CSS-токены

e2e/                # Playwright-спеки (auth, post-crud, account, public)
docs/               # Планы и контракты фич (newsletter, redesign, perf)
scripts/            # push-llm-stats.ts
public/             # favicon, robots, шрифты (og-image), ассеты (см. ниже)
```

**Кто за что отвечает в связке:** страница в `src/app/**/page.tsx` — тонкая: метаданные + рендер вью из `src/sections/<фича>/`. Секция берёт данные через хуки из `src/actions/` (клиент, SWR) или получает их с сервера (SSR-фетчеры `blog-ssr.ts` вызываются прямо в page/layout). Всё, что переиспользуется между секциями, живёт в `src/components/`; правило изоляции секций — жёсткое.

### Конвенции внутри секции

- `const.ts` — статические данные (опции, списки), `types.ts` — типы секции, `utils.ts` — чистые хелперы без JSX, `hooks/` — кастомные хуки, `*-schema.ts` — zod-схемы форм.
- Один React-компонент = один файл, ≤200 строк (ESLint `max-lines` — error).
- kebab-case имена файлов; формы — только через `RHF*`-компоненты (`src/components/hook-form`); без `any` и type assertions; стили — MUI `sx` + палитра темы.
- Полные правила для кода — в [AGENTS.md](AGENTS.md).

## Маршруты

### Публичные (SSG/ISR — статика с фоновой ревалидацией)

| URL                                  | Рендеринг     | Что показывает                                                             |
| ------------------------------------ | ------------- | -------------------------------------------------------------------------- |
| `/`                                  | ISR           | Главная: hero, лента постов, навыки, контакты                              |
| `/post/`                             | ISR 1 ч       | Лента блога (поиск, сортировка, теги)                                      |
| `/post/[id]/`                        | ISR 1 ч + SSG | Пост: контент, счётчик просмотров, комментарии, похожие, JSON-LD, og-image |
| `/news/`                             | ISR 1 ч       | Новости AI (посты с тегом «новости», ведёт бот)                            |
| `/tag/[slug]/`                       | ISR 1 ч       | Посты по тегу                                                              |
| `/changelog/` и `/changelog/[slug]/` | ISR 10 мин    | Релизы AI-моделей (цены, контекст, вердикты)                               |
| `/llm-timeline/`                     | статика       | Интерактивный таймлайн LLM 2018–2025                                       |
| `/portfolio/`                        | статика       | «Обо мне»: опыт, резюме, контакты                                          |
| `/feed.xml`                          | route handler | RSS (+ варианты для news/changelog)                                        |

### Auth (`src/app/auth/`, layout auth-split)

`/auth/jwt/sign-in` · `/auth/jwt/sign-up` · `/auth/verify` (код из письма) · `/auth/reset-password` · `/auth/update-password` · `/auth/success` (callback OAuth). Вью лежат в `src/sections/auth/{jwt,verify,reset-password,update-password}/`.

### Dashboard (клиентский рендер, за `AuthGuard`)

| URL                                               | Что показывает                                       |
| ------------------------------------------------- | ---------------------------------------------------- |
| `/dashboard/`                                     | Обзор                                                |
| `/dashboard/post/` (+ `new`, `[id]`, `[id]/edit`) | Свои посты: CRUD, Tiptap-редактор, превью            |
| `/dashboard/user/account`                         | Профиль: аватар, данные, смена пароля                |
| `/dashboard/admin/posts` · `users`                | Админ: все посты / пользователи (роль `admin`)       |
| `/dashboard/admin/audit-logs`                     | Аудит-лог действий (фильтры по action/target)        |
| `/dashboard/admin/bot`                            | Управление TG-ботом: провайдер, модель, mock, health |
| `/dashboard/admin/llm-stats`                      | Дашборд расходов LLM-харнессов (ApexCharts)          |
| `/dashboard/admin/system`                         | Метрики VDS: CPU/RAM/диск/БД                         |

## Данные и API

Все пути API объявлены **в одном месте** — `src/utils/axios.ts`, объект `endpoints`. Хардкод строк `"/api/…"` по коду запрещён: новую ручку сначала добавляют в `endpoints`.

| Домен        | Ручки                                                                                                                                                | Кто использует                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `auth`       | me, sign-in, sign-up, google, yandex, verify, resend-verification, reset-password, update-password                                                   | `src/auth/context/jwt`, секции auth                               |
| `post`       | list, details, latest, search, new, `[id]/edit`, `[id]/publish`, `[id]/delete`, `[id]/view`, `[id]/comments` (GET/POST/PUT/DELETE)                   | `actions/blog.ts` (SWR), `actions/blog-ssr.ts` (SSR)              |
| `changelog`  | list, `[slug]`                                                                                                                                       | `actions/blog-ssr.ts`                                             |
| `newsletter` | subscribe, confirm, unsubscribe                                                                                                                      | `actions/newsletter.ts`                                           |
| `admin`      | users, `users/[id]`, `posts/[id]`, audit-logs, system-metrics, `bot/*` (status, providers, models, model, mock, models-health), `llm-stats/snapshot` | `actions/admin.ts`, `bot.ts`, `system-metrics.ts`, `llm-stats.ts` |
| `user`       | profile, avatar, change-password                                                                                                                     | `actions/account.ts`                                              |
| `upload`     | `/api/upload`                                                                                                                                        | загрузка картинок (редактор, аватар)                              |

**Клиент:** SWR-хуки в `src/actions/*.ts` (кэш, мутации, revalidate-on-focus для статуса бота). JWT-токен хранится в `sessionStorage` и уходит заголовком `Authorization: Bearer`.

**Сервер (SSG/ISR):** `src/actions/blog-ssr.ts` ходит в бэкенд нативным `fetch` c ретраями транзиентных ошибок (`src/utils/fetch-retry.ts`): 5xx/сеть ретраятся, настоящий 404 бросает `NotFoundError`, и сборка **падает громко**, а не кэширует пустоту (урок инцидента 2026-07-03).

**Ревалидация по кнопке:** `GET /api/revalidate` (route handler, `src/app/api/revalidate/`) — админ жмёт «Обновить кеш» в дашборде, хэндлер проверяет JWT через бэкенд и дергает `revalidatePath` для постов/тегов/news/changelog.

## Авторизация

JWT-флоу без next-middleware — всё на клиенте:

1. `AuthProvider` (`src/auth/context/jwt/`) при монтировании читает токен из `sessionStorage`, валидирует срок (`isValidToken`) и подтверждает через `GET /api/auth/me`.
2. `AuthGuard` оборачивает дерево `/dashboard/*` (redirect на sign-in), `GuestGuard` — страницы auth (redirect в дашборд), `RoleBasedGuard` — админ-разделы (роль из JWT: `user` | `admin`).
3. OAuth Google/Яндекс: редирект на бэкенд (`endpoints.auth.google|yandex`) → callback → `/auth/success` кладёт токен в storage.

## Тема и стили

`src/theme/` — фабрика темы MUI v7 c CSS-переменными: дизайн «Editorial Ink» (шрифты Unbounded / Manrope / JetBrains Mono с кириллицей), оверрайды компонентов в `theme/core/components/`, миксины в `theme/styles/`. Тёмная/светлая тема без «вспышки» — инлайн-скрипт схемы в корневом `layout.tsx`; настройки (режим, direction) — `src/components/settings/` (drawer грузится лениво).

## Тесты

- **Vitest** (`yarn test:unit`) — 16 файлов: `src/server/llm-stats/__tests__` (агрегация статистики), `src/utils` (fetch-retry, feed-xml), утилиты секций blog/changelog/llm-timeline, markdown.
- **Playwright** (`yarn e2e`) — `e2e/*.spec.ts`: auth-флоу, CRUD поста через дашборд, аккаунт, публичные страницы. Поднимает свой сервер на **3055** (у бэкенда должен быть разрешён этот origin в CORS), сериальный одиночный воркер.

## CI и деплой

- **CI** (`.github/workflows/frontend-ci.yml`, на PR и push в main): lint → `tsc --noEmit` → unit-тесты → `madge --circular` → **сборка против прод-API** (`https://api.aifirst.us.com:8444`) → knip-отчёт (не блокирует). Красная сборка = деплой бы выкатил битые страницы.
- **Деплой:** Vercel, автоматически на каждый push в `main`. Env-переменные заданы в Vercel Project Settings. Husky + lint-staged прогоняют ESLint/Prettier на каждый коммит.

## Ассеты в `public/`

Хранится только то, на что реально ссылается код: `fonts/` (Roboto для og-image генерации), `assets/icons/{navbar,setting,files,flagpack,empty,experience}`, `assets/images/{about,cover→бэкенд}`, `assets/background/background-3.webp`, `assets/cv/`, блюры/плейсхолдеры. Обложки постов (`/assets/images/cover/cover-N.webp`) отдаёт **бэкенд** через `NEXT_PUBLIC_ASSET_URL` (см. `src/utils/cover-src.ts` — детерминированный выбор сид-обложки для постов без своей).

## Связанные репозитории

- `blog-app-mui-backend` — API (Next.js 14, PostgreSQL, JWT), деплой на VDS через GitHub Actions.
- `ai-bot-tg` — Telegram-бот, наполняющий новости и changelog (управляется из `/dashboard/admin/bot`).

Конвейер новостного бота — от RSS до публикации поста в блог:

<p align="center">
  <img src="docs/news-bot-pipeline.gif" alt="Конвейер новостного бота: RSS → карточка в Telegram → рерайт LLM → аппрув → публикация" width="720">
</p>
