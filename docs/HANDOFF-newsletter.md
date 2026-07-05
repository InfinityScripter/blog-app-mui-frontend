# HANDOFF — Newsletter (email-подписка + недельный дайджест)

Self-contained бриф для НОВОГО окна. Контекст предыдущей сессии сюда вложен — читать не обязательно ничего снаружи. Дата: 2026-07-01.

## Как стартовать (в новом окне)

Запусти `/task` с описанием: **«реализуй newsletter: email-подписка на блоге + недельный дайджест (бот-черновик, владелец шлёт)»**. Это заведёт worktree + ветки. Затем следуй этому доку.

---

## Контекст: что это за проект

Русскоязычный блог про AI/LLM/агентов — **aifirst.us.com**, один автор (Михаил Талалаев), Telegram-канал @sh0ny. Часть — новостной агрегатор (авто-посты от AI-бота, тег `новости`), часть — оригинальный блог. Позиционирование: «честные разборы — что из AI-инструментов реально работает в проде».

**3 репо (монорепо-соседи в `/Users/talalaev-m/projects/`):**

- `blog-app-mui-frontend/` — Next.js 15 App Router + React 19 + MUI v7, Vercel, порт 3033
- `blog-app-mui-backend/` — Next.js 14 API + PostgreSQL (`pg`) + JWT, VDS `api.aifirst.us.com:8444`, порт 7272
- `ai-bot-tg/` — TG/AI-бот (tsx, grammY, SQLite, vitest), VDS

**Деплой:** fe→Vercel (auto на push main), be/bot→CI на push main (`.github/workflows/*-cicd.yml`, scp→VDS→systemctl restart). Инфра-креды: `~/.config/blog-app/.env` (SSH/DB) + `blog-app-mui-backend/.env` (BOT_API_TOKEN, OWNER_EMAIL, DATABASE_URL, EMAIL_USER/PASSWORD).

## Почему newsletter (из глубокого анализа ниши)

Единственный **owned, portable, algorithm-proof** актив. Сейчас единственный канал подписки — Telegram. Топ AI-блоги (Willison, The Batch, TLDR AI) все держат newsletter как retention-слой. Бот убирает рутину черновика. Формула ниши: **бот ~70% рутины (черновик дайджеста), человек — вердикт + голос**. Полностью-AI RU-каналы теряют подписчиков — дайджест всегда с человеческим «разбором» сверху.

---

## Что УЖЕ есть (не переизобретать — реюз)

**Backend:**

- **Nodemailer настроен** — `src/utils/email.ts`: `transporter` (Gmail SMTP, env `EMAIL_USER`/`EMAIL_PASSWORD`), `sendVerificationEmail(email, code)`, `sendPasswordResetEmail(email, code)`. Реюз transporter для дайджеста/подтверждения подписки.
- **Паттерны для новой сущности** (недавно построен changelog — точный образец): таблица в `src/lib/db.ts` schemaSql (TEXT pk + app uuidv4, btree idx, `DELETE` в resetDatabase); сервис `src/services/*.ts` (raw dbQuery, snake→camel row map); zod-схемы `src/schemas/*.ts`; роуты `src/pages/api/*` (next-connect-style `withMethods`/`validateBody`/`cors`, `ok()`/`sendError()` из `src/utils/response.ts`); rate-limit `src/utils/rate-limit.ts` (`withRateLimit({routeName,windowMs,max})`, gated off под NODE_ENV=test); bot-auth `src/utils/auth.ts` (Bearer BOT_API_TOKEN→owner-admin); audit `emitAudit`.
- **Тесты:** jest + pg-mem (`NODE_ENV=test`), `npm test`. Схема гоняется на pg-mem-boot.
- НЕТ ничего newsletter/subscribe (grep пусто) — чистый старт.

**Frontend:**

- `src/sections/home/home-telegram-cta/` — CTA-блок внизу home. **Capture-блок ставить рядом** (реюз структуры секции).
- RHF: `src/components/hook-form/` — `form-provider.tsx`, `rhf-text-field.tsx`, `fields.tsx`. **Форма подписки = RHF + zod** (правило проекта: не raw MUI inputs в формах).
- SSR-фетчеры `src/actions/blog-ssr.ts` (native fetch + revalidate); клиент-хуки `src/actions/blog.ts` (SWR); endpoints в `src/utils/axios.ts` (`endpoints` object).
- Токены/паттерны: `CONFIG.site.url` = `https://aifirst.us.com` (`src/config-global.ts`), `trailingSlash:true` (все URL со слэшем).

**Bot:**

- Пайплайн новостей/релизов: fetch фидов → LLM-rewrite → **DM владельцу с inline-кнопками** → ✅ публикует в блог-API. Реюз этого паттерна для «собрать дайджест недели → DM владельцу → отправить».
- `src/blog/publishPost.ts` / `publishRelease.ts` — POST в блог-API с `Bearer BOT_API_TOKEN` + `Idempotency-Key`. Образец для «POST дайджеста в newsletter/send».
- LLM: `src/llm/rewriteToPost.ts` (provider dispatch, `CONFIG.REWRITE_*`), `src/llm/prompts.ts`. Новый промпт «собери дайджест из N постов недели» — клон этого.

---

## Правила проекта (ОБЯЗАТЕЛЬНО — иначе CI/husky валит)

- **NO `as`/type-assertions, NO `any`** (type guards). String-параметры-энумы = union, не string.
- **Один компонент = один файл, ≤200 строк** (eslint `max-lines` locked at error). Растёт — резать в const.ts/types.ts/utils.ts/под-компоненты.
- **Хуки в `hooks/` папках**, отдельно от JSX.
- **Frontend src: НЕТ for-of/while/generators** (es5 target + Airbnb) — функциональный код (.map/.filter/.reduce). Husky блокирует commit на lint-error.
- **kebab-case** имена файлов. **MUI `sx`** вместо хардкод-CSS. Формы = RHF\*-компоненты + zod.
- **Bot: `.js` расширения** в относительных импортах (`"type":"module"`).
- **SSR-фетч ВСЕГДА в try/catch** — один backend-500 иначе валит весь Vercel-билд (жёсткий урок).
- **Прод-URL со слэшем** (canonical/sitemap/OG). Cyrillic в URL — encode/decodeURIComponent (+ safeDecode-гвард на страницах).

## Рекомендуемый метод (проверен на 2 фичах в этой сессии)

1. **Scout** параллельно по 3 репо (read-only recon: точные файлы/якоря/паттерны для реюза) → синтез спека с **замороженным контрактом** (TS-интерфейсы, shared по репо).
2. **Реализация** 3 репо параллельно против контракта, каждый сам гоняет ts/lint/test(/build).
3. **Адверсариальное ревью** на каждый репо → фиксы.
4. **Живой интеграционный тест** контракта (поднять backend локально `npm run dev` на 7272 + FE preview, curl эндпоинтов, preview-скриншот).
5. Мерж (backend первым — contract owner) → деплой → прод smoke + regression-проверка существующих страниц.

Оркестрация — через Workflow-тул (ultracode on). Backend определяет контракт → bot+fe консьюмят.

---

## Предлагаемый scope V1 (уточнить с пользователем на старте)

**Backend:**

- Таблица `subscribers` (id, email UNIQUE, status: pending|confirmed|unsubscribed, confirm_token, unsubscribe_token, created_at, confirmed_at). Double-opt-in.
- Роуты: `POST /api/newsletter/subscribe` (public + rate-limit, шлёт confirm-письмо), `GET /api/newsletter/confirm?token=` (подтверждение), `GET /api/newsletter/unsubscribe?token=`, `POST /api/newsletter/send` (bot/admin — рассылка дайджеста подтверждённым).
- Реюз Nodemailer (`email.ts`): добавить `sendConfirmEmail`, `sendDigestEmail`.

**Frontend:**

- Capture-блок (email input + submit, RHF+zod) на home (рядом с telegram-cta) + в подвале поста. POST на subscribe → toast «проверьте почту».
- `/newsletter/confirm` + `/newsletter/unsubscribe` — тонкие страницы статуса (читают token из query).

**Bot:**

- Пайплайн «дайджест недели»: собрать посты за 7 дней (из блог-API), LLM-черновик («что вышло на неделе» + место под вердикт) → DM владельцу с превью → ✅ → POST `/api/newsletter/send`.

**Deferred (не V1):** сегментация, open/click-трекинг, provider-миграция (Resend/Buttondown вместо Gmail SMTP — Gmail лимит ~500/день, ок для старта), шаблонизатор писем, unsubscribe-preference-центр.

**Открытые вопросы пользователю на старте:**

1. Провайдер: Gmail SMTP (уже есть, лимит ~500/день) vs Resend/Buttondown (масштаб, но новый ключ)?
2. Дайджест: авто-cron у бота или только по кнопке владельца?
3. Двойной opt-in (confirm-письмо) — да (рекомендую, анти-спам) или сразу подписка?

---

## Состояние на конец прошлой сессии (справка)

Уже задеплоено в прод в этой сессии (НЕ трогать, это фон):

- **11 quick-wins** (fe: share-кнопки, OG-картинки, /tag/[slug], RSS, public-search; be: индексы posts, opt-in пагинация post/list, per-IP rate-limit; bot: EN AI-фиды, full-body fetch, temperature/max_tokens, ensureSourceLine). Живёт.
- **RU AI Release Changelog** — сущность `model_releases`, /changelog на проде (пустой пока — бот детектит релизы → DM владельцу). Образец для newsletter-паттерна.

Реестр задач: `blog-app-mui-frontend/.claude/worktrees/TASKS.md`.
Память сессии: `~/.claude/projects/-Users-talalaev-m-projects-blog-app-mui-frontend/memory/` (MEMORY.md — индекс; changelog-feature.md, quick-wins-3repo-impl.md — детали).

**Контракт-паттерн (важнейший урок):** при 3-репо фиче — заморозить TS-контракт (payload+response shapes) ДО кода, проверить nesting живым curl'ом. В changelog самый вероятный баг был response-nesting (`data.data.release.id` vs `data.post.id`) — лови такое рано.
