# Глубокий анализ блога aifirst.us.com — ниша, фронт, бэк, бот

Дата: 2026-07-01. Метод: 4 параллельные сессии (frontend / backend / bot / niche-market), затем синтез.

Продукт: русскоязычный блог про AI/LLM/агентов + новостной агрегатор. Один автор (Михаил Талалаев), Telegram @sh0ny. Позиционирование: «кейсы, гайды и честные разборы — что из AI-инструментов реально работает в проде, а что хайп». Стек: Next.js 15 фронт (Vercel), Next.js 14 API (VDS, Postgres), TG/AI-бот (tsx, grammY, SQLite).

---

## 1. Главный вывод (в одну строку)

**SEO-сантехника и инженерная база — сильные для соло-блога. Провал — в reach и content-стратегии.** Ниша RU-AI перенасыщена гайдами для новичков и почти пуста в «живых справочниках» (changelog релизов, лидерборд, сравнительные таблицы) и честных production-кейсах с цифрами. У блога есть уникальный актив — **контент-бот**, способный держать этот справочный слой в свежем виде, чего не могут ни крупные медиа (нет экономики штата), ни другие соло-авторы (нет бота). Это и есть ров.

Формула, которую подтверждают все источники: **бот делает ~70% рутины (сбор данных, черновики, поддержание свежести), человек добавляет экспертизу + голос + честный вердикт.** Полностью AI-каналы в RU теряют подписчиков — «безликий» контент не заходит. Никогда не публиковать сырой вывод бота как продукт.

---

## 2. Что уже сделано хорошо (не трогать)

- **SEO-плумбинг:** per-post `generateMetadata`, JSON-LD (`NewsArticle` с source-attribution для новостей, `Article` для блога), sitemap, robots с Yandex-тюнингом, ISR везде, build-safe try/catch.
- **Бот-инженерия:** URL-dedup + SQLite ledger, state-machine против двойных публикаций, idempotent publish, crash recovery, control-server (админка блога рулит провайдером/моделью), human-in-the-loop (ничего не публикуется без кнопки владельца).
- **Бэк-безопасность (базовая):** JWT + роли, requireAuth/requireAdmin, bcrypt, lockout по failed-login, constant-time сравнение bot-токена, audit_logs с индексами.

---

## 3. Критические дыры (чинить в первую очередь — быстро и больно)

| #   | Проблема                                                                                                      | Где                                                       | Эффект                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------- |
| C1  | **`public/assets/og-image.jpg` не существует** — это site-wide OG И fallback для КАЖДОГО поста без обложки    | `layout.tsx:63`, `post/[id]/page.tsx:22`                  | Каждый шер в TG/X + превью в LLM = битая картинка. #1 по ROI.               |
| C2  | **Кнопки «поделиться» — фейк** (SpeedDial без onClick/href)                                                   | `post-details-hero.tsx:92`                                | Аффорданс есть, шерит в никуда.                                             |
| C3  | **Нет RSS/Atom**                                                                                              | —                                                         | Агрегатор без синдикации; нет подписки для feed-readers и downstream-ботов. |
| C4  | **Теги некликабельны, нет `/tag/[slug]`**                                                                     | `post-item-feed.tsx:49`, `post-details-home-view.tsx:109` | Ноль индексируемых topic-кластеров + нет loop «ещё по теме».                |
| C5  | **Homepage feed — CSR** (пустой HTML для краулеров/LLM)                                                       | `home-feed.tsx:29`                                        | Самый линкуемый URL отдаёт пустоту скраперам.                               |
| C6  | **Ноль индексов на `posts`** кроме PK; `tags` фильтруется JSONB-containment по неиндекс. колонке              | `db.ts:51`, `Post.ts:154`                                 | Каждый feed-запрос = full scan. Ломается на 10x.                            |
| C7  | **Нет пагинации** ни в одном реальном списке; `post/list` отдаёт ВСЕ посты с полным `content`                 | `Post.ts:198`                                             | На 10x контента шлёт весь корпус на каждый feed-load.                       |
| C8  | **Нет rate-limit** нигде; `post/[id]/view` — анонимный POST-инкремент (dedup только client-side localStorage) | `view.ts:11`                                              | Тривиально накрутить/абьюзить.                                              |

---

## 4. Стратегия роста — что строить дальше

### Слой 1. Owned audience (фундамент, всё остальное сюда впадает)

- **RSS-фид** (`/feed.xml` + `/news/feed.xml`) — эффорт XS, реюз `getPosts`/`getNewsPosts`. Бесплатная синдикация.
- **Email-newsletter** — capture-блок (home + подвал поста) + таблица subscribers на бэке + недельный дайджест. Бот пишет черновик, человек — вердикт. Единственный algorithm-proof актив. Реюз Nodemailer (уже есть для auth).
- **Постоянный Telegram-CTA на страницах постов + в хедере** (сейчас только внизу home). Конец статьи = пик интента.

### Слой 2. Бот как ров (живые справочники, которые никто больше не потянет)

- **RU AI Release Changelog** — «что зарелизили в AI», обновляется ботом ежедневно из блогов провайдеров/API. **RU-аналога нет** (в EN проверено: llm-stats.com/llm-updates, pricepertoken, aireleasetracker). Programmatic SEO + магнит цитирований LLM. Автофид в TG/newsletter.
- **Живой лидерборд/матрица сравнения LLM и инструментов** (цена, контекст, бенчи, «для чего годится»), версионированный («Индекс …, v1»), бот держит свежим. **Сделать существующий LLM-usage дашборд публичным** — реальные usage/cost-данные автора = primary source, которого нет ни у кого, LLM такое любят цитировать.
- **Один именной повторяющийся бенчмарк на каждый релиз модели** (бот гоняет + черновик, человек проверяет). Со временем владеешь поисковым запросом.

### Слой 3. Контент-差异化 (закрыть RU-вакуум)

Недообслуженные кластеры (там соло-dev+бот выигрывает): **внутренности агентов** (system prompt, prompt caching, MCP как «LSP для AI»), **автономные агенты на серверах/в CI**, **multi-agent оркестрация/swarm** (claude-flow, vibe-kanban), **production-кейсы с реальными метриками** (стоимость, время, что сломалось) — ровно позиционирование «честных разборов». Плюс **day-of разборы релизов на русском** (бот-черновик из блога провайдера → таблица → честный вердикт), пока держится 24–72ч волна поиска/соц.

### Слой 4. Бот — content-качество (сейчас узкое место)

- **Добавить EN AI-frontier источники** (arXiv cs.AI/cs.CL, блоги OpenAI/Anthropic/Google/Meta, HN по ключам, Simon Willison) — RU-rewrite-промпт уже превращает EN→RU. Сейчас фиды — общий RU dev/hardware, не AI. `parseFeed.ts:18`.
- **Тянуть полное тело статьи** для RSS-item перед rewrite (реюз `fetchArticle`), а не ≤4000-символьный сниппет — сейчас rewrite = тонкий пересказ лида. `ingestArticle.ts:177`.
- **Cross-post в TG-канал** при публикации (сейчас нет никакой дистрибуции — посты живут только на блоге). Хук в `handleApprove`.
- **Скармливать usage/cost в LLM-stats дашборд** (сейчас `response.usage` выбрасывается). `rewriteToPost.ts:177`.
- **Original-article mode**: кластеризовать несколько связанных item'ов → один глубокий аналитический пост со ссылками на все источники. Из summarizer'а в комментатора — главный差异化.
- Мелочи: выставить temperature + поднять `max_tokens` (сейчас 2048 капит длину); enforce source-attribution в схеме (сейчас только в промпте, может тихо пропасть); включить relevance-фильтр из `shadow` в `on`.

### Слой 5. GEO / попадание в цитаты LLM (компаундится на каждом посте)

- **GEO-native шаблон поста**: ответ-первым (BLUF, первые ~200 слов), таблицы для «X vs Y», нумерованные шаги для «как», FAQ-блок, видимая дата «обновлено», именной автор, реальные цифры, исходящие цитаты. Самый сильный рычаг — статистика/цифры (+41% цитируемости, Princeton GEO).
- Разрешить GPTBot/ClaudeBot/PerplexityBot/Google-Extended в robots; держать public-роуты SSR/ISR (краулеры не исполняют JS).
- Свежесть: 30-дневный контент цитируется ~3.2×; бот-справочники тут выигрывают структурно.

---

## 5. Дистрибуция (где на самом деле аудитория)

- **Telegram @sh0ny (RU-ядро):** 3–5 постов/нед, 18:00–20:00 MSK, картинки +30–40% реакций. Взлом через папки, кросс-посты/обмены с каналами 5–10k, засев в тематических чатах. Бот ~70%, человек — голос. Игроки-ориентиры: эйай ньюз (~85k, нейродайджест — формат-эталон), Сиолошная (~66k), LLM под капотом (~18k, ближайший сосед).
- **Habr:** RU technical authority + топ-донор цитирований в LLM. Конкретные заголовки, H2/H3, сравнительные таблицы, TL;DR, кейсы с числами.
- **Hacker News / Reddit (EN):** самые большие разовые спайки; Reddit тяжело цитируется (Perplexity ~47% из Reddit). r/LocalLLaMA, r/MachineLearning, r/AI_Agents.
- **X/Twitter:** треды как дистрибуция для лонгформа; реплаи — быстрейший cold-start.

---

## 6. Топ-10 ставок (ранжировано, payoff ÷ effort)

1. **RSS + email-newsletter (бот-черновик, человек-редактор).** Owned, portable, algorithm-proof фундамент. Эффорт S–M. Payoff High.
2. **Bot-maintained RU AI Release Changelog (daily).** Нет RU-конкурента, доказанный EN-спрос, programmatic SEO + citation-магнит. Эффорт M. Payoff Very high. **Ядро рва.**
3. **Живой версионированный лидерборд/сравнение + публичный LLM-usage дашборд.** Реальные данные = primary source, которого ни у кого нет. Эффорт M–L. Payoff Very high.
4. **GEO-шаблон + structured data + доступ краулерам на всех постах.** Дешёвый one-time рычаг, компаундится. Эффорт S. Payoff High.
5. **Именной повторяющийся бенчмарк на каждый релиз (бот-гоняет).** Владение поисковым запросом. Эффорт S/релиз. Payoff High.
6. **Глубокие кластеры: внутренности агентов, агенты на серверах, оркестрация, prod-кейсы с метриками.** RU-вакуум + позиционирование. Эффорт M/шт. Payoff High.
7. **Day-of разборы релизов на RU.** Бот-черновик быстро, человек-вердикт; свежий RU-мост к EN-фронтиру. Эффорт S–M/релиз. Payoff High.
8. **Дистрибуция портфелем: TG + Habr ядро, HN/Reddit/X спайки.** Бот перепаковывает под формат канала. Эффорт M ongoing. Payoff High.
9. **Годовой reading-list + tool-directory + TIL-секция.** Bot-assembled evergreen, long-tail SEO, гарантированный ежегодный сиквел. Эффорт M. Payoff Medium–high.
10. **`llms.txt` + правило «человеческий голос на ВСЁм выводе бота».** llms.txt дёшев (маргинальный эффект сегодня); voice-правило — несущее (полностью-AI RU-каналы теряют подписчиков). Эффорт XS. Payoff Medium / критичный guardrail.

---

## 7. Быстрые технические победы (S-эффорт, делать скопом)

Фронт: создать `og-image.jpg` (C1); завести RSS (C3); подключить реальные share-кнопки (C2); `/tag/[slug]` + кликабельные чипы (C4); вынести public-search в хедер (компонент уже есть, только в дашборде); почистить template-мусор (`_mock`, `endpoints.mail/product`, `sections/blank`) + починить `#`-ссылки в подвале.

Бэк: индексы на `posts` (`publish`, `created_at`, `user_id`, GIN на `tags`) — C6; пагинация `post/list` + убрать `content` из list-ответа (C7); rate-limit на публичные+auth эндпоинты (C8); `slug` + `published_at` на посты; починить N+1 в `post/details` и full-scan в `post/latest`.

Бот: EN AI-источники + full-body fetch + temperature/max_tokens; enforce attribution; relevance `shadow`→`on`.

---

## 8. Sources (market research)

Ниша RU: [vc.ru подборка](https://vc.ru/id700659/2033247-podborka-tg-kanalov-pro-ii), [Tproger](https://tproger.ru/articles/7-rossijskih-telegram-kanalov-pro-ii-i-promting), [DevBox Tools](https://devbox.tools/blog/1158-telegram-channels-and-chats-on-llms-ai-and-machine-learning/), [Telemetr эйай ньюз](https://telemetr.me/content/ai_newz).
Топ-блоги: [simonwillison.net](https://simonwillison.net), [pelican-bicycle](https://github.com/simonw/pelican-bicycle), [latent.space](https://latent.space), [The Batch](https://www.deeplearning.ai/the-batch/), [Interconnects](https://interconnects.ai).
Changelog/лидерборды: [llm-stats.com/llm-updates](https://llm-stats.com/llm-updates), [pricepertoken](https://pricepertoken.com/news/model-releases), [aireleasetracker](https://aireleasetracker.com/), [artificialanalysis.ai](https://artificialanalysis.ai).
GEO/SEO: [Princeton GEO](https://derivatex.agency/blog/princeton-geo-paper-plain-english), [Yext 17.2M citations](https://www.yext.com/blog/how-chatgpt-perplexity-gemini-claude-decide-what-to-cite), [Habr GEO 2026](https://habr.com/ru/articles/1042732/).

---

## 9. Апдейт 2026-07-09 — разбор и фиксы (сессия ревью)

**Найден и исправлен реальный баг «пост не публикуется через админку».** Создание работало (201, строка в БД), но новый пост НЕ появлялся в дашборде «Все посты». Две причины:

- **Root cause — источник авторизации.** `pages/api/post/list.ts` (`readAuth`) и `search.ts` (`readUserId`) читали токен только из заголовка `Authorization: Bearer`, но авторизация давно на httpOnly-cookie (`access_token`), который SPA шлёт автоматически, а заголовок — нет. Итог: запрос админа падал в анонимную ветку `publish='published'` → черновики и чужие посты в таблице не видны. Фикс: `bearerToken ?? readCookie(req, ACCESS_COOKIE)` (как в `require-auth.ts`). Регресс-тест: `tests/api/post/list.test.ts` (admin-cookie видит черновики).
- **ISR-протухание.** `app/api/revalidate/route.ts` ревалидировал несуществующие безлокальные пути (`/`, `/post/[id]`) после перехода на `/[locale]/…` — тихий no-op. Фикс: `revalidatePath("/[locale]", "layout")` + пофидовые URL по локалям.

**C2 done ранее? нет — статус на 2026-07-09:** C1 (OG generator) / C2 (share) / C4 (`/tag/[slug]`) / C6 (индексы) / C8 (rate-limit) — **FIXED** (проверено). C3 — RSS есть, changelog-фид **теперь** прилинкован в `<head>`. C5 — list/detail SSR-crawlable, но домашняя лента всё ещё CSR. C7 — бэкенд-пагинация готова, но фронт её не использует (**остаётся**).

**Прочие фиксы этой сессии (frontend):** гонка `URL.createObjectURL` (утечка в превью поста) → revoke в cleanup; decorative «Включить комментарии» switch (никуда не сохранялся) удалён; `getInitColorSchemeScript`/`LoadingButton` (15 файлов) → актуальные MUI v7 API (`InitColorSchemeScript`, `Button loading`); `watch()` сужен до нужных полей; aria-label на icon-only кнопках; single-flight refresh reset через `.finally`; anchored `AUTH_BYPASS_PATHS`; `toError` сохраняет axios-контекст; пустые catch (revalidate/delete/publish/comment/copy-link) теперь логируют + тост; мёртвый код (5 файлов + экспортов) убран.

**Backend security:** upload — лимит 5 МБ + allow-list image MIME; отдача файла — `nosniff` + безопасный content-type + attachment для не-картинок, без утечки `error.message`; reset-code → `crypto.randomInt`; rate-limit на reset/update-password; sendMail в reset — fire-and-forget (убирает timing-oracle); `Post.saveComments()` — точечный UPDATE, не перетирает атомарный `total_views` (регресс-тест в `comment.test.ts`).

**Тесты:** backend 408 pass (+4), frontend unit 164 pass, e2e post-CRUD 4/4 (create→view→edit→delete через реальный UI). Осталось (не трогал в этой сессии): C5 (SSR домашней ленты), C7 (пагинация на фронте), N+1 в `post/details`, full-scan в `post/latest`.
