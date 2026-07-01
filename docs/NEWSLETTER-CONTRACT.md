# Newsletter — FROZEN CONTRACT + implementation spec (V1)

Single source of truth for the 3-repo newsletter feature. Backend owns the contract; frontend + bot consume it. **Do not deviate from the payload/response shapes below** — they were verified against the existing changelog feature (the exact template).

Feature: email subscription on the blog (double-opt-in) + owner-triggered weekly digest. Provider = Gmail SMTP (reuse `email.ts`). Digest send = Gmail (limit ~500/day, fine for V1).

---

## 0. Decisions locked (do not re-litigate)

- **Provider:** Gmail SMTP, reuse `blog-app-mui-backend/src/utils/email.ts` transporter. New fns `sendConfirmEmail`, `sendDigestEmail`.
- **Double-opt-in:** YES. subscribe → status `pending` + confirm email. confirm link → `confirmed`.
- **Digest trigger:** owner button only (bot `/digest` command → DM preview → ✅ → send). No auto-cron in V1.
- **Capture placement (FE):** home (new section next to telegram-cta) AND post footer (before "Комментарии").
- **Digest source (bot):** `GET /api/post/list?limit=50` (public, newest-first) → filter client-side to last 7 days by `createdAt`. NO new read endpoint needed — blog is source of truth, catches hand-made posts too.
- **Tokens:** two opaque `uuidv4` per subscriber — `confirm_token` (used once, 24h validity via `confirm_expires_at`) and `unsubscribe_token` (permanent). Never reuse across status transitions.
- **Unsubscribe:** reversible (status→`unsubscribed`). Re-subscribe of an existing email → resets to `pending` + fresh confirm_token + new email.

---

## 1. FROZEN TS CONTRACT (shared shapes)

### Subscriber DTO (backend service returns this; camelCase, ISO dates)
```ts
type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

interface Subscriber {
  id: string;
  email: string;
  status: SubscriberStatus;
  createdAt: string;      // ISO
  confirmedAt: string | null; // ISO or null
}
// NOTE: confirm_token / unsubscribe_token / confirm_expires_at are NEVER returned in any API response (secret). Internal only.
```

### Endpoint contract (path · method · auth · body/query · response)

| Endpoint | Method | Auth | Request | Success response |
|---|---|---|---|---|
| `/api/newsletter/subscribe` | POST | public + rate-limit | `{ email: string }` | `201` `ok()` → `{ success:true, data:{ subscriber:{id,email,status} } }` (status always `"pending"`; **email fields NEVER leak token**) |
| `/api/newsletter/confirm` | GET | public + rate-limit | query `?token=<uuid>` | `200` `ok()` → `{ success:true, data:{ subscriber:{email,status} } }` (status `"confirmed"`) |
| `/api/newsletter/unsubscribe` | GET | public + rate-limit | query `?token=<uuid>` | `200` `ok()` → `{ success:true, data:{ email, status:"unsubscribed" } }` |
| `/api/newsletter/send` | POST | requireAuth→requireAdmin (Bearer BOT_API_TOKEN ok) | `{ subject: string, html: string }` | `200` `ok()` → `{ success:true, data:{ sent:number, failed:number } }` |

**Error responses** (all via `sendError`): `{ success:false, message }` with status:
- subscribe: `409` if email already `confirmed` (message "Вы уже подписаны"). If `pending`/`unsubscribed` existing → re-issue confirm (200/201, NOT 409). `400` invalid email (zod).
- confirm: `404` invalid/unknown token; `410` (Gone) expired token (`confirm_expires_at` in past) — message "Ссылка устарела, подпишитесь заново".
- unsubscribe: `404` invalid token. Idempotent: already-unsubscribed token → still `200` (message "Вы отписаны").
- send: `400` invalid body; `401`/`403` no/insufficient auth.

**Response envelope rule (verified against changelog):** WRITE routes use `ok(res, data, {status})` → `{success:true, data:{...}}`. So bot reads `data.data.sent` on `/send`, frontend reads `data.data.subscriber` on subscribe/confirm. (This is the `data.data.X` nesting — the exact bug class flagged in changelog handoff. Verify with live curl.)

---

## 2. BACKEND (contract owner — merge FIRST)

Repo: `/Users/talalaev-m/projects/blog-app-mui-backend`. Template = the **changelog** feature (`model_releases`). Clone it file-for-file.

### 2.1 DB — `src/lib/db.ts`
Add to `schemaSql` (after `model_releases` block, ~line 209):
```sql
CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  confirm_token TEXT,
  confirm_expires_at TIMESTAMPTZ,
  unsubscribe_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_unique ON subscribers (LOWER(email));
CREATE INDEX IF NOT EXISTS subscribers_status_idx ON subscribers (status);
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_confirm_token_idx ON subscribers (confirm_token);
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_unsub_token_idx ON subscribers (unsubscribe_token);
```
`LOWER(email)` unique → case-insensitive dedup (matches users table pattern). Add `await pool.query('DELETE FROM subscribers');` to `resetDatabase()` (~line 319) so test isolation works.

### 2.2 Schema — `src/schemas/newsletter.ts` (clone `schemas/model-release.ts`)
```ts
import { z } from "zod";
export const subscribeSchema = z.object({ email: z.string().trim().email().max(255) });
const tokenQuery = z.preprocess(v => Array.isArray(v)?v[0]:v, z.string().trim().uuid());
export const tokenQuerySchema = z.object({ token: tokenQuery });
export const sendDigestSchema = z.object({
  subject: z.string().trim().min(1).max(300),
  html: z.string().trim().min(1).max(200_000),
});
export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type SendDigestInput = z.infer<typeof sendDigestSchema>;
```

### 2.3 Service — `src/services/subscriber.ts` (clone `services/model-release.ts`)
Export `subscriberService = { subscribe, confirm, unsubscribe, listConfirmed }`.
- `mapRow(row): Subscriber` — snake→camel, `toIso` for dates, NEVER map tokens into the returned DTO.
- `subscribe(email)`: lookup by `LOWER(email)`. If found & `confirmed` → throw `AppError(409, "Вы уже подписаны")`. If found & (`pending`|`unsubscribed`) → regenerate confirm_token + confirm_expires_at (NOW+24h), status→`pending`, UPDATE. Else INSERT new with uuidv4 id + confirm_token(uuidv4) + unsubscribe_token(uuidv4) + confirm_expires_at. Return `{ subscriber, confirmToken }` (route needs token to send email; token stays out of the DTO).
- `confirm(token)`: SELECT by confirm_token. Not found → `AppError(404)`. `confirm_expires_at` < now → `AppError(410, "Ссылка устарела...")`. Else UPDATE status→`confirmed`, confirmed_at=NOW, confirm_token=NULL (single-use). Return mapped subscriber.
- `unsubscribe(token)`: SELECT by unsubscribe_token. Not found → `AppError(404)`. Else UPDATE status→`unsubscribed` (idempotent — re-running is fine). Return `{ email }`.
- `listConfirmed()`: `SELECT email, unsubscribe_token FROM subscribers WHERE status='confirmed'` → `{ email: string; unsubscribeToken: string }[]`. (send.ts needs the per-subscriber unsubscribe token so each digest email carries a working unsubscribe link — the bot only sends one shared html; the PER-RECIPIENT unsubscribe footer is appended by the backend in `sendDigestEmail`.)
- `isUniqueViolation` guard (code 23505) as in model-release.

### 2.4 Email — `src/utils/email.ts` (append two fns, imitate `sendVerificationEmail`)
```ts
export const sendConfirmEmail = async (email: string, confirmToken: string) => { /* link → `${FRONTEND_URL}/newsletter/confirm/?token=${confirmToken}` (TRAILING SLASH — FE has trailingSlash:true). RU copy. */ };
export const sendDigestEmail = async (email: string, subject: string, html: string, unsubscribeToken?: string) => { /* send `html` as-is; append unsubscribe footer link → `${FRONTEND_URL}/newsletter/unsubscribe/?token=${unsubscribeToken}` */ };
```
Do NOT add `as` casts in your new code (the file has legacy `as string` — don't copy that). Read `process.env.FRONTEND_URL` with a localhost fallback.

### 2.5 Routes — `src/pages/api/newsletter/*.ts`
- `subscribe.ts`: `export default withRateLimit({routeName:'newsletter.subscribe', windowMs:60_000, max:5, enabledInTest:true})(withMethods([POST])(validateBody(subscribeSchema)(handler)))`. Handler: `dbConnect` → `subscriberService.subscribe(email)` → fire-and-forget `sendConfirmEmail(email, confirmToken).catch(logSilently)` (email failure must NOT fail the request in a way that loses the subscriber — but DO surface a 500 only if the DB write failed) → `emitAudit(req,{action:'newsletter.subscribed',targetType:'subscriber',targetId,metadata:{email}})` → `ok(res,{subscriber},{status:HTTP.CREATED})`. **cors() first** (public).
- `confirm.ts`: `withRateLimit({routeName:'newsletter.confirm',windowMs:60_000,max:20})(withMethods([GET])(validateQuery(tokenQuerySchema)(handler)))`. cors() first. → `subscriberService.confirm(token)` → audit `newsletter.confirmed` → `ok(res,{subscriber})`.
- `unsubscribe.ts`: same shape, GET, `newsletter.unsubscribe`. → `subscriberService.unsubscribe(token)` → audit → `ok(res,{email,status:'unsubscribed'})`.
- `send.ts`: `requireAuth(requireAdmin(withMethods([POST])(validateBody(sendDigestSchema)(handler))))`. Handler: `listConfirmed()` → `Promise.allSettled(recipients.map(r => sendDigestEmail(r.email, subject, html, r.unsubscribeToken)))`, count fulfilled/rejected → audit `newsletter.sent` metadata `{sent,failed}` → `ok(res,{sent,failed})`. Reuse changelog/new.ts middleware order EXACTLY.

### 2.6 Tests — `src/tests/api/newsletter/newsletter.test.ts` (clone `changelog.test.ts`)
`jest.mock('@/src/utils/email')` (no real SMTP). Cases: subscribe valid→201+status pending+email fn called; subscribe duplicate-confirmed→409; subscribe re-subscribe pending→new token; confirm valid→confirmed; confirm bad token→404; confirm expired→410; unsubscribe valid→200; unsubscribe idempotent→200; send without auth→401/403; send with bot token→200 sends to confirmed only. Rate-limit: subscribe 6th call→429 (enabledInTest).
`jest.mock('@/src/utils/cors')` like changelog test. Run: `npm test`.

### 2.7 env — `.env.example`: confirm `FRONTEND_URL`, `EMAIL_USER`, `EMAIL_PASSWORD`, `BOT_API_TOKEN` present (all already exist for changelog/auth). No new vars.

Gate before merge: `npm run ts` (0 errors), `npm run lint:fix`, `npm test` (all green).

---

## 3. FRONTEND

Repo worktree: `/Users/talalaev-m/projects/blog-app-mui-frontend/.claude/worktrees/newsletter`. **Edit ONLY in the worktree.** Rules: no `as`/`any`, ≤200 lines/file, hooks in `hooks/`, no for-of/while, kebab-case, MUI `sx`, RHF fields (not raw MUI), trailingSlash.

### 3.1 endpoints — `src/utils/axios.ts`
Add to `endpoints` object (after `changelog`):
```ts
newsletter: {
  subscribe: "/api/newsletter/subscribe",
  confirm: "/api/newsletter/confirm",
  unsubscribe: "/api/newsletter/unsubscribe",
},
```

### 3.2 action — `src/actions/newsletter.ts` (new file, clone `addComment` pattern)
```ts
import axios, { endpoints } from "src/utils/axios";
interface SubscribeResponse { success: boolean; data: { subscriber: { id: string; email: string; status: string } }; }
export async function subscribeToNewsletter(email: string): Promise<SubscribeResponse> {
  const res = await axios.post<SubscribeResponse>(endpoints.newsletter.subscribe, { email });
  return res.data;
}
interface StatusResponse { success: boolean; data: { subscriber?: { email: string; status: string }; email?: string; status?: string }; }
export async function confirmSubscription(token: string): Promise<StatusResponse> {
  const res = await axios.get<StatusResponse>(`${endpoints.newsletter.confirm}?token=${encodeURIComponent(token)}`);
  return res.data;
}
export async function unsubscribeFromNewsletter(token: string): Promise<StatusResponse> {
  const res = await axios.get<StatusResponse>(`${endpoints.newsletter.unsubscribe}?token=${encodeURIComponent(token)}`);
  return res.data;
}
```

### 3.3 Capture section — `src/sections/home/home-newsletter-cta/`
Clone `home-telegram-cta/` structure exactly:
- `const.ts` — labels (`NL_LABEL`, `NL_TITLE`, `NL_TEXT`, `NL_BUTTON`, `NL_SUCCESS`). RU copy positioning "честные разборы AI".
- `newsletter-schema.ts` — `z.object({ email: z.string().email("Введите корректный email") })`.
- `home-newsletter-cta.tsx` — same Container/Stack/alpha-theme layout as telegram-cta, but with an inline RHF form: `Form` + `RHFTextField name="email" type="email"` + `LoadingButton type="submit" loading={isSubmitting}`. On submit → `subscribeToNewsletter(email)` → `toast.success(NL_SUCCESS)` ("Проверьте почту — отправили письмо для подтверждения") + `reset()`. On 409 → `toast.error(err.message)`. Import `toast` from `src/components/snackbar`, `RHFTextField` DIRECT (not barrel), `Form` from `form-provider`. **Keep ≤200 lines** — if tight, the form can be its own `newsletter-form.tsx` sub-component.
- `index.ts` — `export { HomeNewsletterCta } from "./home-newsletter-cta";`
Render it in `src/sections/home/view/home-view.tsx` — add `<HomeNewsletterCta />` between `<HomeFeed />` and `<HomeTelegramCta />`.

### 3.4 Post-footer capture
Reuse the SAME form component. Extract the RHF form into a shared `src/sections/blog/post-newsletter-cta.tsx` (thin wrapper importing the same action) OR — simpler — make `home-newsletter-cta` export a compact `NewsletterForm` and render it in `post-details-home-view.tsx` just BEFORE the "Комментарии" Stack (~line 134). A slimmer variant (no big heading) is fine. Keep files ≤200 lines.

### 3.5 Status pages (clone `src/app/auth/success/page.tsx`)
- `src/app/newsletter/confirm/page.tsx` — `"use client"`, read `token` via `new URLSearchParams(window.location.search).get("token")`, `useEffect` → `confirmSubscription(token)` → success Alert "Подписка подтверждена ✅" / error Alert. Container + Stack + CircularProgress while loading.
- `src/app/newsletter/unsubscribe/page.tsx` — same, `unsubscribeFromNewsletter(token)` → "Вы отписались".
Keep each page thin (a `use-newsletter-confirm.ts` hook in a local `hooks/` folder if logic > a few lines — hooks rule). trailingSlash: routes are `/newsletter/confirm/` etc.

Gate before merge: `npm run ts`(=tsc), `npm run lint`, `npm run build` (needs backend up on :7272 OR the pages must be client-only so build doesn't fetch). Confirm the 2 new pages are `"use client"` so no SSG fetch → no build-time backend dependency.

---

## 4. BOT

Repo: `/Users/talalaev-m/projects/ai-bot-tg`. Rules: `.js` extensions in relative imports, functional style, vitest. Template = news/release pipeline + `publishRelease.ts`.

### 4.1 Fetch last-7-days posts — `src/blog/fetchRecentPosts.ts` (new)
```ts
import { CONFIG } from "../config.js";
interface BlogPost { _id?: string; id?: string; title: string; description?: string; createdAt: string; tags?: string[]; }
export async function fetchRecentPosts(days = 7): Promise<BlogPost[]> {
  const url = `${CONFIG.BLOG_API_URL.replace(/\/$/,"")}/api/post/list?limit=50`;
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(`Blog list responded ${res.status}`);
  const data = await res.json() as { posts?: BlogPost[] };
  const cutoff = Date.now() - days * 86_400_000;
  return (data.posts ?? []).filter(p => new Date(p.createdAt).getTime() >= cutoff);
}
```
NOTE: `/api/post/list` returns a BARE `{ posts }` (verified — the unpaginated/list path). Pass `?limit=50` → paginated newest-first path returns `{ posts, total, hasMore }`. Either way read `.posts`.

### 4.2 Digest LLM — `src/llm/buildDigest.ts` + prompt in `src/llm/prompts.ts`
Add `DIGEST_SYSTEM_PROMPT` (RU): "Ты редактор еженедельного AI-дайджеста. По списку постов за неделю (заголовок+описание) собери короткое письмо-дайджест: тёплое вступление 1-2 предложения, затем список постов (заголовок + 1 строка), оставь ЯВНОЕ место '{{ВЕРДИКТ}}' в конце для личного разбора владельца. Верни JSON `{ subject, html }` — subject до 120 символов, html — простой email-HTML (h2/p/ul/li/a), без внешнего CSS." Reuse provider dispatch from `rewriteToPost.ts` (`resolveActiveProvider` + the OpenAI-compat/Anthropic call). Return `{ subject: string, html: string }`.

### 4.3 Send endpoint client — `src/blog/sendDigest.ts` (clone `publishRelease.ts`)
```ts
export async function sendDigest(subject: string, html: string, idempotencyKey?: string): Promise<{ sent: number; failed: number }> {
  const url = `${CONFIG.BLOG_API_URL.replace(/\/$/,"")}/api/newsletter/send`;
  const res = await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${CONFIG.BOT_API_TOKEN}`, ...(idempotencyKey?{"Idempotency-Key":idempotencyKey}:{}) }, body: JSON.stringify({ subject, html }) });
  if (res.status !== 200) { const t = await res.text().catch(()=> ""); throw new PublishError(`Newsletter send ${res.status}: ${t.slice(0,200)}`, res.status>=500); }
  const data = await res.json() as { data?: { sent?: number; failed?: number } };
  return { sent: data.data?.sent ?? 0, failed: data.data?.failed ?? 0 };
}
```
Read `data.data.sent` (ok() envelope — same nesting as publishRelease reads `data.data.release.id`).

### 4.4 Command + review flow
- `/digest` command in `src/bot.ts` (register alongside `/fetch`): `runDigest(ctx)` → reply "Собираю дайджест…" → `fetchRecentPosts(7)` → if empty, reply "За неделю нет постов" → else `buildDigest(posts)` → store draft in a small module-level `pendingDigest` (in-memory: `{ subject, html }`) → send DM preview (subject + html-as-text-preview, truncated) with inline keyboard `✅ Отправить` / `🔄 Пересобрать` / `❌ Отмена`. Define `DIGEST_CALLBACK = { SEND:"digest_send", REBUILD:"digest_rebuild", CANCEL:"digest_cancel" }` in `src/consts.ts` (distinct prefixes, no collision with CARD_CALLBACK).
- Callback handling: route in the `callback_query:data` handler BEFORE `onCallback` (digest callbacks don't touch a candidate). On `✅` → `sendDigest(pending.subject, pending.html)` → editMessageText "✅ Отправлено N подписчикам (M ошибок)"; on `🔄` → rebuild; on `❌` → clear pending, edit "Отменено". Owner-lock already covers it (bot is owner-locked globally).
- Keep the digest handler in its OWN file `src/bot/digestFlow.ts` (createHandlers.ts is already 258 lines — don't grow it). Export a `createDigestFlow(bot)` returning `{ runDigest, onDigestCallback, isDigestCallback }`; wire into bot.ts.
- The digest DM does NOT need the candidate-store; a single module-scoped pending draft is enough for V1 (one owner, one draft at a time). Overwrite on rebuild.

### 4.5 Tests — `tests/send-digest.test.ts` + `tests/fetch-recent-posts.test.ts` (clone `publish-release.test.ts`)
Mock fetch. Assert: sendDigest posts to `/api/newsletter/send` with Bearer + body `{subject,html}`, reads `data.data.sent`; 5xx → PublishError maybePosted. fetchRecentPosts filters by 7-day cutoff, reads `.posts`. buildDigest returns `{subject,html}` (mock the LLM). Run: `npm test` (vitest).

Gate before merge: `npm run build`(tsc) + `npm test` green.

---

## 5. Integration test (after all 3 impl + review)

1. Backend up: `cd blog-app-mui-backend && npm run dev` (:7272). Seed a confirmed subscriber or curl subscribe.
2. `curl -sX POST :7272/api/newsletter/subscribe -H 'Content-Type: application/json' -d '{"email":"t@e.st"}'` → expect `201 {success:true,data:{subscriber:{status:"pending"}}}`. **Confirm the `data.data` nesting matches what FE/bot read.**
3. Grab confirm_token from server log (email is logged in dev) → `curl ':7272/api/newsletter/confirm?token=<uuid>'` → `200 confirmed`.
4. `curl -sX POST :7272/api/newsletter/send -H "Authorization: Bearer $BOT_API_TOKEN" -H 'Content-Type: application/json' -d '{"subject":"x","html":"<p>y</p>"}'` → `200 {data:{sent,failed}}`.
5. FE preview (worktree, port 3055 per [Worktree preview env trap]): home shows newsletter section; submit → toast; `/newsletter/confirm/?token=x` renders. Screenshot.
6. Bot: run `/digest` locally against the running backend (or a vitest integration) — verify DM preview + send path hits `/send`.

## 6. Merge order
Backend FIRST (contract owner) → then frontend + bot (can be parallel). Each on its own branch. Do NOT push without explicit user OK (per changelog handoff — build+commit, verify, then user decides push).
