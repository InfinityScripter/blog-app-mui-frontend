# Bot Control Panel in Admin — Design Spec

**Date:** 2026-06-21
**Status:** Design — awaiting user review before plan
**Scope:** Surface the ai-bot-tg news-bot's runtime model selection + "без LLM" (mock) toggle + health in the blog admin UI.

## Problem

The Telegram news bot (`ai-bot-tg`, branch `claude/pensive-leakey-8141bc`) can already switch its rewrite provider/model at runtime (`/model` command) and run in mock mode (post raw, no LLM). That control lives entirely in Telegram. An admin wants to see and drive the same controls from the blog admin panel.

## Verified preconditions (read from branch `claude/pensive-leakey-8141bc`)

These exist on the branch and are **reused**, not built:

- `src/providers.ts` — `PROVIDERS` registry (`anthropic`, `gemini`, `glm`, `deepseek`, `mock`), `resolveActiveProvider(store)`, `hasActiveOverride(store)`, `MODEL_PRICES`, `modelPriceLabel`, `providerNames`, `isProviderName`.
- `src/models.ts` — `listModels(provider)` (live `/models` + fallback, capped 50, always non-empty), `pingModel(provider, model)`.
- `src/store.ts` — `settings` table + low-level `setSetting`/`getSetting`, `getModelOverride`/`setModelOverride`/`clearModelOverride`.
- `src/bot.ts` / `src/bot-model.ts` — `/model` command + inline keyboards (the racing writer is real).
- `src/rewriter.ts` — already calls `resolveActiveProvider` and supports anthropic + openai-compat providers.
- `src/scheduler.ts` — `croner` job, `nextRun()` (may return `null`).

Providers gemini/glm/deepseek use raw `fetch` to OpenAI-compatible endpoints — **no SDK deps** needed (package.json deps stay as-is). No new provider work in this spec.

**New bot work is only:** `mock_override` in the settings table + a control HTTP server.

## Architecture

```
Admin browser ──JWT──▶ blog-backend /api/admin/bot/*  ──Bearer BOT_CONTROL_TOKEN──▶ bot 127.0.0.1:CONTROL_PORT /control/*
   (RoleBasedGuard)        (requireAuth+requireAdmin)         (localhost only, loopback bind)
```

- Bot stays internal: control server binds `127.0.0.1` only, never `0.0.0.0`, no CORS.
- Reuses existing admin auth (`requireAuth(requireAdmin)`) — no new auth on the blog side.
- `BOT_CONTROL_TOKEN` is a **new, separate** secret (backend→bot). `BOT_API_TOKEN` (bot→blog, `auth.ts:36`) is **untouched**.
- Admin auth is **bearer-JWT in the `Authorization` header** (not cookie) → POST routes are **not CSRF-exposed**; no CSRF token needed.

## V1 scope (locked)

In: active provider+model + model list, mock toggle, bot health. **Out (deferred):** candidates queue, uptime/metrics, `nextRun` display, `hasOverride` surfacing. The bot status payload is trimmed to exactly what the UI renders.

**V1 providers = `glm`, `deepseek`, `mock` ONLY** (user decision 2026-06-21: dropped `anthropic` + `gemini` — gemini is geo-limited from RU, anthropic ping is key-presence-only/dishonest). The control surface (bot `/control/providers`, backend guard, frontend const) exposes only these three. The bot's `PROVIDERS` registry still physically contains anthropic/gemini (the rewriter/`/model` Telegram command keep working with them) — but the **admin panel and its backend reject/omit anything outside `glm|deepseek|mock`**. New union `ControlProviderName = 'glm' | 'deepseek' | 'mock'` gates every admin-facing layer.

---

## Canonical wire contract (single source of truth — resolves all cross-layer drift)

One port, one path scheme (query param), one status shape, one model shape. Any deviation in any layer is a bug.

### Bot control server — `127.0.0.1:${CONTROL_PORT}`

All endpoints require `Authorization: Bearer ${BOT_CONTROL_TOKEN}`. Missing header → `401 {error}`. Wrong token → `403 {error}` (compared with `crypto.timingSafeEqual`).

| Method | Path                              | Request                | 200 response                                 |
| ------ | --------------------------------- | ---------------------- | -------------------------------------------- |
| GET    | `/control/status`                 | —                      | `{ provider, model, isMockEnabled }`         |
| GET    | `/control/providers`              | —                      | `{ providers: [{ name, label, hasKey }] }`   |
| GET    | `/control/models?provider=<name>` | query                  | `{ provider, models: [{ id, tier, note }] }` |
| POST   | `/control/model`                  | `{ provider, model }`  | `{ ok: true, validation }`                   |
| POST   | `/control/mock`                   | `{ enabled: boolean }` | `{ ok: true, isMockEnabled }`                |

Types:

- `provider` / `name`: `ControlProviderName = 'glm' | 'deepseek' | 'mock'` (union, never raw string). The control server validates the `?provider=` / body `provider` against this set and `400`s anything else (incl. anthropic/gemini, which exist in the bot but are not admin-controllable in V1).
- `model.tier`: `'free' | 'paid'`; `model.note`: `string | undefined` (from `MODEL_PRICES`). **The bot enriches** `listModels` strings into `{id,tier,note}` objects by joining `MODEL_PRICES`; backend and frontend pass objects through unchanged (no duplicated price table).
- `validation`: `'pinged' | 'key-present-only'` — for V1 providers, `glm`/`deepseek` are openai-compat → real probe → `'pinged'`; `mock` → trivially `'pinged'`. (The `'key-present-only'` case is for anthropic, kept in the type for completeness but unreachable in V1.) Constraint #3's honesty label thus does not surface in V1 — `glm`/`deepseek` selections are genuinely probed.
- `isMockEnabled`: the single resolved boolean (see mock precedence below).

Errors: bad provider → `400 {error:'Unknown provider'}`. Ping fail on `/control/model` → `400 {error}` and the store is **not** updated.

### Backend proxy — `/api/admin/bot/*` (all `requireAuth(requireAdmin)`)

Thin route → `src/services/bot-control.ts` → bot. Response envelope follows the new `ok()`/`sendError` helper: `{ success: true, data }` / `{ success: false, message }`.

| Method | Path                              | Maps to              | Success                                                                | Failure                                                   |
| ------ | --------------------------------- | -------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------- |
| GET    | `/api/admin/bot/status`           | `/control/status`    | `200 {success, data:{ isAlive:true, provider, model, isMockEnabled }}` | bot unreachable → `200 {success, data:{ isAlive:false }}` |
| GET    | `/api/admin/bot/providers`        | `/control/providers` | `200 {success, data:{ providers }}`                                    | `503`                                                     |
| GET    | `/api/admin/bot/models?provider=` | `/control/models`    | `200 {success, data:{ provider, models }}`                             | `400` bad provider / `503`                                |
| POST   | `/api/admin/bot/model`            | `/control/model`     | `200 {success, message, validation}`                                   | `400` ping/validation / `503`                             |
| POST   | `/api/admin/bot/mock`             | `/control/mock`      | `200 {success, isMockEnabled}`                                         | `503`                                                     |

**Health is backend-synthesized (constraint #1).** The bot can NEVER report its own death — a dead bot returns connection-refused, not a body. `status` is the only route that maps unreachable → `isAlive:false` inside a `200` (so the SWR hook always gets a readable body and the chip can render "down"). All other routes return `503` on unreachable.

**ECONNREFUSED detection (constraint #1 correctness):** Node's undici `fetch` surfaces a refused connection as a `TypeError` whose `.cause.code === 'ECONNREFUSED'` — the top-level `.message` is the generic `'fetch failed'` and top-level `.code` is undefined. The service MUST inspect `error.cause?.code` (via a typed narrowing helper, **no `as`**), and also treat `AbortError` (timeout, `AbortSignal.timeout(8000)`) as unreachable. A check on top-level `.code`/`.message` would silently miss the refusal and the chip would never show down.

### Frontend — `src/sections/admin/admin-bot-view.tsx`

Consumes the backend envelopes above. Health chip keyed off `isAlive: boolean` (not a `status` string). Provider Select offers only `glm | deepseek | mock`. Model picker renders `{id,tier,note}` objects with `🆓`/`💲` icons. V1 providers are genuinely probed (`validation: 'pinged'`), so no "ключ есть" caveat is shown — a successful model switch means the model answered.

---

## Mock precedence (resolves blocker #6 + the "broken toggle" trap)

One mechanism: a dedicated `mock_override` settings row holding `{ enabled: boolean }` (NOT overloaded onto `model_override`). New store methods: `getMockOverride()` → `{enabled} | null`, `setMockOverride(enabled)`, `clearMockOverride()`.

Resolved boolean in `resolveActiveProvider` — **db override is strictly authoritative when set** (UI is always truthful):

```
const mockDb = store.getMockOverride();      // {enabled} | null
const forceMock = mockDb ? mockDb.enabled : CONFIG.REWRITE_MOCK;
if (forceMock) return { provider: 'mock', model: 'mock' };
// ...existing model-override / env-default logic
```

Consequence stated plainly: once an admin toggles mock in the UI, the db row wins over `env REWRITE_MOCK` in **both** directions — toggling OFF truly turns mock off even if `REWRITE_MOCK=1` in env. `POST /control/mock {enabled}` always **sets** the row (never clears on `false`), so the toggle is never a lie. `isMockEnabled` in `/control/status` = this same resolved `forceMock`.

---

## Per-layer changes

### Layer 1 — bot (`ai-bot-tg`), deploy FIRST

| File                    | Change                                                                                                                                                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/store.ts`          | NEW `MOCK_OVERRIDE_KEY` + `getMockOverride`/`setMockOverride`/`clearMockOverride` (mirror the model-override methods).                                                                                                                                                                                                         |
| `src/providers.ts`      | `resolveActiveProvider` honors `getMockOverride` per precedence above.                                                                                                                                                                                                                                                         |
| `src/control-server.ts` | NEW. `node:http` server (no new dep), bind `127.0.0.1:CONTROL_PORT`, Bearer auth via `timingSafeEqual`, the 5 endpoints. Enriches models via `MODEL_PRICES`. Exports `startControlServer(...)` → `{ close }`. Logs only `error.cause?.code` + path — **never** the `Authorization` header or full request (secret-leak guard). |
| `src/index.ts`          | Start control server when token is set; `close()` it in shutdown before `bot.stop()`.                                                                                                                                                                                                                                          |
| `src/config.ts`         | NEW `CONTROL_PORT` (default 8455), `BOT_CONTROL_TOKEN` **optional** — if unset, the control server is **not started** and the bot runs/publishes normally (degrade gracefully; do NOT `process.exit(1)`). Min length 16 when present.                                                                                          |

### Layer 2 — backend (`blog-app-mui-backend`), deploy SECOND

| File                                                              | Change                                                                                                                                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/services/bot-control.ts`                                     | NEW client: `getStatus/listProviders/listModels/setModel/setMock`. Typed interfaces matching the wire contract (no `as`/`any`). ECONNREFUSED/timeout → unreachable via `error.cause?.code`. |
| `src/pages/api/admin/bot/{status,providers,models,model,mock}.ts` | NEW thin routes, `requireAuth(requireAdmin)` + `cors`, method-guarded, `sendError` on throw. Routes 503 cleanly if `BOT_CONTROL_URL`/`BOT_CONTROL_TOKEN` unset (never 500 on undefined).    |
| `.env` / `.env.example`                                           | NEW `BOT_CONTROL_URL` (e.g. `http://127.0.0.1:8455`), `BOT_CONTROL_TOKEN`. `BOT_API_TOKEN` untouched.                                                                                       |

`requireAdmin` runs **before** any bot fetch → a non-admin gets `403` and never triggers a bot call.

### Layer 3 — frontend (this worktree), deploy LAST

| File                                    | Change                                                                                                                                                                                                                                               |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/utils/axios.ts`                    | `endpoints.admin.bot.{status, providers, models(provider), model, mock}`.                                                                                                                                                                            |
| `src/actions/admin.ts`                  | `useGetBotStatus()` (**`revalidateOnFocus: true`** — constraint #2), `useGetBotProviders()`, `useGetBotModels(provider)` (enabled only when provider chosen), `setBotModel(provider, model)`, `setBotMock(enabled)`. Typed responses, no assertions. |
| `src/sections/admin/types.ts`           | `BotStatus`, `BotProvider`, `BotModel`, `ProviderName` union, health-color type.                                                                                                                                                                     |
| `src/sections/admin/const.ts`           | `BOT_PROVIDER_NAMES = ['glm','deepseek','mock']`, tier icons (`free='🆓'`, `paid='💲'`).                                                                                                                                                             |
| `src/sections/admin/utils.ts`           | `getHealthColor(isAlive)`, model label formatter (tier + note), Claude honesty label.                                                                                                                                                                |
| `src/sections/admin/admin-bot-view.tsx` | NEW. Health chip, active provider/model, provider Select → model Select (tier labels), mock Switch.                                                                                                                                                  |
| `src/app/dashboard/admin/bot/page.tsx`  | NEW. `RoleBasedGuard acceptRoles={['admin']}`.                                                                                                                                                                                                       |
| `src/routes/paths.ts`                   | `dashboard.admin.bot`.                                                                                                                                                                                                                               |
| `src/layouts/config-nav-dashboard.tsx`  | Nav item after "Журнал аудита", reuse `ICONS.dashboard` (no custom svg — matches audit-logs). Title "AI-бот".                                                                                                                                        |

### UI states (resolves the empty/down-state gap)

- **Bot down** (`isAlive:false`): offline banner, all controls disabled, no crash on `provider===undefined`.
- **Empty model list**: disabled Select, "нет доступных моделей" (bot guarantees non-empty, but guard anyway).
- **Provider without key** (`hasKey:false`): rendered disabled with "нет ключа".
- **setModel failure**: revert optimistic SWR mutation, toast the bot's error string.
- **mock selected**: no model picker (mock has a single trivial model); show "посты уходят без переработки LLM".

---

## Testing (proof, not assertion)

**Bot (vitest):** `mock_override` get/set/clear + `resolveActiveProvider` precedence cases; control server on a random port — `401` no token, `403` wrong token (`timingSafeEqual`), `200` valid; loopback bind asserted; `POST /control/model` writes store; `listModels` enrichment shape.

**Backend (jest + supertest + pg-mem):** `401` no JWT; `403` non-admin (and asserts **no** bot fetch happened); `200` admin happy path (bot mocked); **closed-port → `status` returns `isAlive:false`, other routes `503`** (the constraint-1 test — points `BOT_CONTROL_URL` at a dead port and asserts the `error.cause.code` path fires); unset-env → `503` not `500`.

**Frontend:** `npm run lint` + `tsc --noEmit` = 0 (no `as`/`any`, provider union). Playwright spec gated behind a **mocked** `/api/admin/bot/*` (no live bot needed in CI). Preview proof: dev server in worktree (port 3055, no `--turbo`, symlink node_modules, copy `.env.local`), login admin (`demo@minimals.cc`), `preview_snapshot` + `preview_screenshot`, toggle model, `preview_network` confirms POST + status refetch.

**End-to-end honest round-trip (manual, user-run):** user runs bot locally → admin toggles model → confirm via Telegram `/model` that the override applied. The only fully trustworthy check.

## Deploy order & safety

bot → backend → frontend. Each layer degrades safely if the next isn't shipped:

- Backend proxy `503`s / returns `isAlive:false` harmlessly until the bot's control server ships.
- Frontend shows "down" until the backend ships.
- `BOT_CONTROL_TOKEN` is **optional on the bot** → shipping the bot code without the env var added does **not** crash the existing publish pipeline. Add the VDS `.env.production` var before/with the bot deploy.

Nothing hard-breaks at any half-deployed state.

## Security checklist

- Control server: loopback-only bind, Bearer + `timingSafeEqual`, optional-token degrade, no CORS.
- Secret never logged on either side (redact `Authorization`, log only `error.cause?.code` + path).
- `BOT_CONTROL_TOKEN` ≠ `BOT_API_TOKEN`; min length 16.
- Admin POST routes are bearer-JWT → no CSRF surface.
- `requireAdmin` gates before any proxied call.

## Out of scope (explicit YAGNI)

Candidates queue, uptime/metrics, `nextRun` display, `hasOverride` surfacing, model-list caching, a `GET/PUT /control/settings` aggregate (revisit only if flags multiply), provider SDK additions.
