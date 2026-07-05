# Site-wide i18n — Design Spec

**Date:** 2026-07-05
**Branch:** `claude/site-i18n-geo-locale`
**Status:** Approved (architecture), autonomous execution to completion.

## Goal

Translate the whole site (currently 100% Russian) into multiple languages with:
- **Geo auto-detection** on first visit (region → language).
- **Manual language switcher**, including switching back to the Russian original.
- Language choice **remembered** across visits.
- **Russian is the original / fallback.** V1 languages: **RU + EN** (architecture extensible to more).

Two content types, two translation lanes:
1. **Static UI chrome** (~500 strings across ~260 component files) → hand-curated static JSON catalogs (`next-intl`), EN generated once via DeepL, committed.
2. **Dynamic post/news bodies** (Russian free-text HTML from Postgres) → machine-translated by the **backend** via DeepL, cached in Postgres per `(post, lang)`. `lang=ru` returns the untouched original.

## Decisions (locked)

| Aspect | Choice | Why |
|---|---|---|
| UI mechanism | `next-intl` static JSON catalogs | Industry standard for Next 15 App Router; best SEO/perf; zero runtime cost for chrome. |
| Content mechanism | Backend translates → cache in Postgres `post_translations` | Durable cache, best SEO (translated HTML server-rendered), lowest repeat cost. |
| Translator | **DeepL API** (free tier, `api-free.deepl.com`) | Best RU→EN quality, `tag_handling=html` preserves markup, skips `<script>/<style>/<code>`. Abstracted behind a `TranslationProvider` interface so it's swappable. |
| URL scheme | **Path prefix** `/ru`, `/en` (`[locale]` segment), `localePrefix: "always"` | Best SEO (per-language URL, hreflang, shareable EN links). Root `/` → middleware redirect. |
| Language resolution | cookie → geo (`x-vercel-ip-country`) → `Accept-Language` → default `ru` | Matches "geo auto-detect + manual switcher"; manual pick writes cookie and wins. |
| Deploy target | Vercel serverless/SSR (`isStaticExport = "false"`, verified) | Middleware runs; not static export → full next-intl middleware works. |

## Stack facts (verified during exploration)

- Frontend: Next.js 15 App Router + React 19 + MUI v7. `next.config`: `trailingSlash: true`, `basePath` from `NEXT_PUBLIC_BASE_PATH`, `isStaticExport = "false"`.
- No existing i18n lib. RTL plumbing exists (`SettingsState.direction`, `src/theme/with-settings/right-to-left.tsx`) — reuse the settings pattern for the language control.
- `lang="ru"` hardcoded in `src/app/layout.tsx:130`. Fonts already `subsets: ["latin","cyrillic"]`.
- Backend: Next 14, `pg` Pool (`src/lib/db.ts`), no axios/node-fetch → use global `fetch`. Tables created via idempotent `.mjs` scripts in `scripts/` (pattern: `seed-changelog.mjs`). `pg-mem` in tests when `NODE_ENV=test`.
- Providers today (root `layout.tsx`): `AuthProvider` → `SettingsProvider` → `ThemeProvider` → `MotionLazy` → drawers/snackbar.

## Frontend architecture

### File / route reorg

Move under a new `src/app/[locale]/` segment (via `git mv` to preserve history):
`(index)`, `auth`, `changelog`, `dashboard`, `library`, `llm-compare`, `llm-timeline`, `news`, `newsletter`, `post`, `tag`, plus `loading.tsx`, `not-found.tsx`.

**Stay at `src/app/` root** (locale-agnostic / handle locale internally):
`api/`, `feed.xml/route.ts`, `llms.txt/route.ts`, `sitemap.ts`, `icon.tsx`, `opengraph-image.tsx`.

### Layout split

- `src/app/layout.tsx` (root) → minimal: `<html lang={locale}>` where possible, `<body>`, global no-flash color-scheme script, `AuthProvider` may stay here or move. Actually per next-intl, the `<html>`/`<body>` and `NextIntlClientProvider` live in `[locale]/layout.tsx`. Root `layout.tsx` reduces to a pure passthrough returning `children` (Next requires a root layout, but a locale layout can own `<html>`). **Chosen:** root `layout.tsx` returns `children` only; `[locale]/layout.tsx` owns `<html>`+`<body>`+all providers.
- `src/app/[locale]/layout.tsx`: `generateStaticParams` for locales, `hasLocale` guard → `notFound()`, `setRequestLocale(locale)` for static rendering, `NextIntlClientProvider`, then existing `AuthProvider`→`SettingsProvider`→`ThemeProvider`→… tree, `<html lang={locale} dir=…>`.

### next-intl wiring

- `src/i18n/routing.ts` — `defineRouting({ locales: ["ru","en"], defaultLocale: "ru", localePrefix: "always" })`.
- `src/i18n/request.ts` — `getRequestConfig` loading `messages/${locale}.json`.
- `src/i18n/navigation.ts` — `createNavigation(routing)` → locale-aware `Link`, `redirect`, `usePathname`, `useRouter`.
- `src/middleware.ts` — `createMiddleware(routing)` with custom geo pre-step (read `x-vercel-ip-country`, seed locale cookie if none) then delegate. Matcher excludes `api|_next|_vercel|feed.xml|llms.txt|sitemap|.*\..*`.
- `next.config` — wrap with `createNextIntlPlugin()`.

### Existing navigation must become locale-aware

Every internal `next/link` / `next/navigation` import used in public chrome must route through `src/i18n/navigation.ts` (or `src/routes/hooks` re-exports get pointed at it) so links preserve the active locale. `src/routes/paths.ts` stays path-only; the locale prefix is added by the navigation wrappers, not baked into `paths.ts`.

### Message catalogs

- `messages/ru.json`, `messages/en.json` — namespaced by feature (e.g. `nav`, `footer`, `home.hero`, `blog`, `news`, `common`).
- Extraction: replace hardcoded Russian literals (both inline JSX and per-feature `const.ts`) with `t("namespace.key")`. `const.ts` data arrays that carry display labels either move label text into catalogs (keyed) or the component maps a stable `id` → `t()`.
- EN catalog generated once by a build-time script (`scripts/i18n-translate-catalog.mjs`) calling DeepL on `ru.json` string values, then committed. Re-runnable to fill only missing keys.

### Language switcher

- Component `src/components/language-switcher/` (generic reusable). Mounts in `src/layouts/main` header next to the settings/theme control, and optionally an entry in the settings drawer.
- On select: `router.replace(pathname, {locale})` via next-intl navigation → URL prefix swaps, cookie updated. "Русский (оригинал)" is an explicit option.
- Adds `language` to nothing in `SettingsState` (locale is owned by the URL/next-intl, not the settings cookie) — avoids dual source of truth. The settings drawer entry just calls the same switch.

### Post content flow

- `src/utils/axios.ts` `endpoints.post.details/list/latest/search` gain a `lang` query param.
- `src/actions/blog.ts` SWR hooks read the active locale (from `useLocale()`), include it in the SWR key, pass `?lang=`. `lang=ru` → original.
- Post render (`src/sections/blog` / `post-details-preview.tsx` `<Markdown>{content}</Markdown>`) unchanged — it just renders whatever body the API returns for the active lang.
- SSR/ISR fetch helpers (`src/actions/blog-ssr.ts`, `generateStaticParams`, `generateMetadata`) pass locale through; guarded with try/catch (existing convention).

### SEO

- `generateMetadata` per locale (title/description/OG `locale`), `alternates.languages` (hreflang ru/en).
- `sitemap.ts` emits both `/ru/…` and `/en/…`. `feed.xml`, `llms.txt` stay RU (original) in V1 (documented).

## Backend architecture

### `post_translations` table

```
post_translations (
  post_id      TEXT/INT  → posts.id
  lang         TEXT      -- 'en' (ru = original, never stored)
  title        TEXT
  description  TEXT
  content      TEXT      -- translated HTML
  source_hash  TEXT      -- hash of source (title+desc+content) to detect staleness
  status       TEXT      -- 'ok' | 'pending' | 'error'
  created_at, updated_at
  PRIMARY KEY (post_id, lang)
)
```

Created by idempotent `scripts/add-post-translations.mjs` (mirrors `seed-changelog.mjs`). Runs in CI deploy step like the changelog seed (not manual SSH).

### Translation provider

- `src/utils/translate.ts` — `TranslationProvider` interface `{ translateHtml(text, {source, target}): Promise<string> }`. `DeepLProvider` impl: POST `api-free.deepl.com/v2/translate`, `tag_handling=html`, `source_lang=RU`, `target_lang=EN-US`, `Authorization: DeepL-Auth-Key`. Chunk bodies > ~100 KiB (128 KiB hard cap) by splitting on top-level block boundaries. `context` param used for glossary/tone if helpful.
- Env `DEEPL_AUTH_KEY`. Missing key → provider returns original + logs (graceful, never 500s the read path).

### Read path

- `post/details.ts` & `post/list.ts` read `lang` query (default `ru`).
  - `lang=ru` (or absent) → current behavior, original row.
  - `lang=en` → look up `post_translations`. Hit + fresh `source_hash` → return translated. Miss/stale → translate now (title, description, content), upsert, return. On provider error → fall back to original, `status='error'`.
- Response shape unchanged (`{ post }` / list) — the `title/description/content` fields just carry translated values. Frontend needs no shape change.
- Bulk warm (optional, later): a script or bot step pre-translates recent posts to avoid first-visitor latency.

### Cost / rate control

- Cache-first means each post translated once per lang until source changes (hash guard). 500k free chars/mo is ample for a personal blog. If exceeded, provider degrades to original + logs; no hard failure.

## Data flow (EN post view)

```
User → /en/post/123
  → middleware: cookie=en (or geo) confirmed
  → [locale] layout: setRequestLocale('en'), NextIntlClientProvider(messages/en.json)
  → page fetch: GET /api/post/details?id=123&lang=en
      backend: post_translations hit? → translated HTML
               miss → DeepL(tag_handling=html) → upsert → translated HTML
  → <Markdown>{translatedContent}</Markdown>
  → chrome (nav/footer/labels) via t() from en.json
```

## Error handling

- Missing/invalid locale in URL → `notFound()` (404) via `hasLocale` guard.
- DeepL down / no key → backend returns Russian original, logs, `status='error'`; UI still renders (chrome in EN, body in RU). No 500.
- Missing message key → next-intl falls back to key / default locale; extraction self-review catches gaps.
- SSG/ISR fetch failures → existing try/catch convention (guard every build-time fetch).

## Scope for V1

**In:** all public routes fully localized (home, post, news, changelog, llm-timeline, llm-compare, library, tag, newsletter, portfolio), geo+manual switch, RU+EN, post body machine-translation w/ cache, hreflang/sitemap.

**Out (documented cuts):**
- **Dashboard / auth chrome** stays Russian in V1 (admin-only, single user). It still lives under `[locale]` for routing consistency but its strings aren't extracted yet. (Follow-up.)
- Additional languages beyond EN (architecture ready; add locale + catalog + rerun DeepL script).
- `feed.xml` / `llms.txt` localization (stay RU original).
- Pre-warming translations (on-demand + cache is enough for V1).
- Translating user-generated comments.

## Testing / verification

- Frontend: `npm run build` (must pass; `[locale]` static params + no `max-lines`/lint regressions), `npm run lint`, `npx tsc --noEmit`, `npm run test:unit` (Vitest). Verify in Playwright: `/` redirects by geo/cookie, `/en` and `/ru` render, switcher swaps URL+chrome, header/footer present (browser DOM, not grep — per project gotcha).
- Backend: `npm run ts`, `npm test` (Jest + pg-mem) incl. a `post_translations` cache-hit/miss test with a mocked provider, `npm run lint:fix`.
- Contract doc `docs/I18N-CONTRACT.md` (like NEWSLETTER-CONTRACT) fixes the `?lang=` param + response invariants so FE/BE stay in sync.

## Rollout

1. Backend branch: table + provider + read-path + tests + CI migration step. Merge/push per playbook.
2. Frontend worktree: next-intl wiring + reorg + catalogs + switcher + post-lang plumbing. Build/verify.
3. Env: `DEEPL_AUTH_KEY` on Vercel (frontend not needed) + backend VDS/CI.
4. Deploy backend (push main → CI), then frontend (push → Vercel), verify live in browser.
