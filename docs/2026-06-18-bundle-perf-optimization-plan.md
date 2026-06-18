# План: оптимизация производительности talalaev.su (Next.js, бандл)

Дата: 2026-06-18
База: `origin/main` (Next.js 15, прод на talalaev.su). НЕ Vite SPA-ветка.
Цель: убрать раздутый JS-бандл и нестабильный serverless-рендер. Остаёмся на Next.js.

## Контекст и измерения (зафиксировано до начала работ)

Замеры live `https://talalaev.su/post/` (Lighthouse + сеть):

| Метрика                    | Desktop | Mobile     |
| -------------------------- | ------- | ---------- |
| Performance                | 84/100  | **61/100** |
| FCP                        | 0.5s    | 1.2s       |
| LCP                        | 2.1s    | **9.5s**   |
| TTI                        | 2.1s    | **9.6s**   |
| TBT                        | 0ms     | 290ms      |
| Server response (root doc) | 40ms    | —          |

Дополнительно:

- Backend API (VPS `api.talalaev.su:8444`) — `/api/post/list` TTFB ~147ms. Быстрый, НЕ узкое место.
- На странице `/post/` грузится **~86 JS-файлов, ~205 запросов, ~1.5 MB** передачи.
- Lighthouse: **~892 KiB неиспользуемого JavaScript** ("Reduce unused JavaScript").
- `x-vercel-cache: MISS` на каждом запросе главной и `/post/` → страницы **dynamic**, заголовки `cache-control: private, no-cache, no-store, must-revalidate`, `vary: RSC`.
- Эпизодические **503 на RSC-prefetch** (`/?_rsc=`, `/portfolio/?_rsc=`) — воспроизводятся не всегда, признак cold-start serverless.
- `next.config.mjs` УЖЕ содержит `modularizeImports` (@mui/material, icons, lab) и `experimental.optimizePackageImports`. Значит barrel-mui частично решён — жир в другом месте.

## Вывод по архитектуре

Проблема — **бандл и конфигурация рендеринга, НЕ выбор фреймворка**. SPA (Vite) это не починит: тот же Minimals-код даст те же ~892KB unused JS, плюс потеря SSR-HTML (SEO блога) и пустой экран до гидрации на мобиле → на мобиле станет хуже. Поэтому: **Next.js + бить по бандлу и кэшу**.

## Задачи (по убыванию влияния на цифры)

### 0. Завести e2e-обвязку на main (ДО рефакторинга — иначе режем без сети безопасности)

- Контекст: на `origin/main` (Next.js) фронтенд-тестов НЕТ вообще. Полноценная Playwright-обвязка (13 спеков: auth/guards, post CRUD, public pages; `playwright.config.ts` с авто-стартом сервера; `e2e/global-setup.ts` сидит non-admin юзера в Postgres; `e2e/fixtures`) существует ТОЛЬКО на ветке `codex/remove-ssr-spa` и написана под **Vite** (`webServer.command = vite ...`, `baseURL` :3055).
- Портировать её на main:
  - Перенести `e2e/`, `playwright.config.ts`, добавить `@playwright/test` в devDeps и скрипт `"e2e": "playwright test"`.
  - `webServer.command` → запуск Next (`next dev -p <port>` или `next build && next start`), поправить `baseURL`/порт.
  - Проверить селекторы спеков под Next-разметку (на main другой роутинг/layout, чем в SPA): тексты/`data-testid` могут отличаться — чинить по факту падений.
  - `global-setup.ts` читает `DATABASE_URL` из `../blog-app-mui-backend/.env`; требует backend на :7272 + seeded Postgres. Сохранить.
- Зелёный прогон `npm run e2e` ДО задач 2-4. Эти же спеки = регрессионная сеть для перф-рефакторинга (особенно «admin lists all posts», «public blog list loads», «post detail deep-link»).
- Если порт под Next тяжёл для CI — допустимо гонять против `next start` (prod build), это ближе к реальному Vercel-поведению.

### 1. Замер бандла (СНАЧАЛА — без него режем вслепую)

- `webpack-bundle-analyzer` уже в deps. Подключить `@next/bundle-analyzer` (или прямой плагин) к `next.config.mjs` под флагом `ANALYZE=true`.
- `ANALYZE=true next build`, сохранить отчёт.
- Найти: какие тяжёлые модули (chat/kanban/calendar/dashboard, apexcharts, framer-motion, tiptap, mapbox) попадают в чанки **публичных** роутов (`/`, `/post`, `/post/[id]`, `/portfolio`, `/faqs`).
- **Зафиксировать топ-5 модулей по весу в публичных чанках** — это вход для задачи 2.

### 2. Code-splitting публичных страниц

- Цель: выкинуть админ/dashboard/chat/kanban/calendar код из бандла блога.
- Тяжёлые ниже-фолда / условные компоненты → `next/dynamic` с `{ ssr: false }` где SEO не нужен (виджеты, редактор, карты, чарты).
- Проверить глобальные импорты в `layout`/провайдерах, которые тащат всё приложение в каждый роут.
- Проверить `apexcharts`/`react-apexcharts`, `framer-motion`, `tiptap`, `mapbox` — грузятся только там, где реально используются.
- Метрика успеха: unused JS на `/post/` < ~300 KiB (было ~892), число JS-файлов на `/post/` заметно вниз.

### 3. ISR/SSG вместо dynamic для блога

- Сейчас блог-страницы dynamic (`no-store`) → каждый заход = serverless рендер с нуля (cold-start latency + 503).
- Блог-контент статичен. Применить:
  - `/post/[id]` → `generateStaticParams` + `export const revalidate = 3600` (ISR).
  - `/post` (список) → ISR `revalidate`.
  - Публичные информационные (`/portfolio`, `/faqs`) → static/ISR.
- Проверить причину dynamic: использование `cookies()`/`headers()`/`searchParams` в RSC, `force-dynamic`, или fetch без `next: { revalidate }`. Авторизованные данные тянуть client-side (SWR), чтобы страница осталась статичной.
- Метрика успеха: `x-vercel-cache: HIT` на `/post/` и `/post/[id]` после прогрева; 503 на RSC не воспроизводятся.

### 4. Снизить агрессивный prefetch

- Next грузит ~7 маршрутов наперёд (видно в network: `/`, `/portfolio`, `/dashboard`, `/faqs`, `/post/<id>` через `?_rsc=`).
- На некритичных `<Link>` (особенно ссылки в дашборд/футер с публичных страниц) выставить `prefetch={false}`.
- Метрика успеха: меньше фоновых `?_rsc=` запросов при загрузке `/post/`.

## Проверка результата

- Повторить Lighthouse mobile+desktop на тех же роутах, сравнить с таблицей выше.
- Цель mobile: Performance ≥ 80, LCP < 3.0s, TTI < 4.0s.
- Прогнать `npm run build` (билд зелёный), `npm run lint`, e2e (`npm run e2e`) — без регрессий.
- Проверить SEO: у публичных страниц SSR-HTML с контентом (`curl` показывает текст постов в HTML, не пустой div).

## Границы (НЕ делать)

- НЕ переписывать на Vite/SPA.
- НЕ трогать backend (он быстрый).
- НЕ менять дизайн/UX — только перф/архитектура загрузки.
- Lighthouse ставить из публичного registry: `npx --registry=https://registry.npmjs.org lighthouse ...` (внутренний Yandex-mirror его не содержит). `CHROME_PATH` указывать на установленный Chrome/Canary.
