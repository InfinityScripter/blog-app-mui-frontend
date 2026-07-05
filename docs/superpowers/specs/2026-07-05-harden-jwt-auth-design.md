# Harden JWT auth — design

**Date:** 2026-07-05
**Branch:** `claude/harden-jwt-auth` (frontend) + a matching branch on `blog-app-mui-backend`
**Status:** IMPLEMENTED + verified (see "Implementation refinements" and
"Verification" at the end)

## Problem

The task framing was "JWT auth is insecure, pick a better option, maybe adopt
better-auth". Reading the actual code shows the auth is **already hardened** in
most respects (bcrypt, failed-attempt lockout, fail-fast `JWT_SECRET`, per-IP
rate-limit, RBAC, constant-time bot-token compare). So a framework migration is
**not** warranted — it would rip out a working, audited system across two repos
and a live prod app for no security gain.

Three **real** weaknesses remain:

1. **OAuth token in the URL.** `google/callback.ts` and `yandex/callback.ts`
   redirect to `${FRONTEND_URL}/auth/success?token=<JWT>`. The token lands in
   browser history, `Referer` headers, and any proxy/access log. **High.**
2. **Access token in `sessionStorage`.** Readable by any XSS on the page; no
   `httpOnly` protection. **Medium.**
3. **No revocation / refresh.** A 30-day token is valid until expiry; logout is
   client-only (drops the local copy, server still honours the token). A stolen
   token cannot be killed. **Medium.**

## Decision

Keep the JWT design. Close all three via:

- **httpOnly cookies** for token transport (kills #1 and #2).
- **Short-lived access token (15 min) + rotating refresh token (30 days)** with
  a **server-side `refresh_tokens` table** (adds real revocation → #3).
- **`SameSite=None; Secure` + double-submit CSRF token**, because prod runs
  frontend (`aifirst.us.com`) and API (`api.aifirst.us.com:8444`) on different
  origins, so cookies must be cross-site, which reopens CSRF that Bearer headers
  were immune to.

No `better-auth`. No new heavyweight deps (hand-rolled cookie + CSRF helpers;
`jsonwebtoken` and `bcrypt` stay).

## Token model

| Token   | TTL     | Cookie name     | Attributes                                              | Storage            |
|---------|---------|-----------------|--------------------------------------------------------|--------------------|
| Access  | 15 min  | `access_token`  | `HttpOnly; Secure; SameSite=None; Path=/`              | stateless JWT      |
| Refresh | 30 days | `refresh_token` | `HttpOnly; Secure; SameSite=None; Path=/api/auth`      | **DB row (hashed)**|
| CSRF    | 30 days | `csrf_token`    | `Secure; SameSite=None; Path=/` (NOT HttpOnly — JS reads it) | stateless random |

- Dev (`NODE_ENV !== 'production'` and non-https origin): cookies are set
  **without `Secure`** and with `SameSite=Lax` so localhost http works. Prod
  gets `Secure; SameSite=None`. One helper decides this from the request.
- The **refresh token is stored hashed** (SHA-256) in the DB — a DB leak must
  not hand out usable refresh tokens. The raw value lives only in the cookie.
- The access-token JWT payload is unchanged (`{ userId, role }`), so
  `require-auth`'s verify path and everything downstream keeps working — only
  the *transport* changes (cookie instead of `Authorization` header).

### `refresh_tokens` table (appended to `schemaSql` in `db.ts`)

```sql
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash   TEXT NOT NULL UNIQUE,   -- SHA-256 of the raw refresh token
  family_id    TEXT NOT NULL,          -- rotation lineage; theft revokes the family
  expires_at   TIMESTAMPTZ NOT NULL,
  revoked_at   TIMESTAMPTZ,            -- set when rotated out or logged out
  replaced_by  TEXT,                   -- id of the successor row (audit trail)
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS refresh_tokens_user_id_idx ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_family_id_idx ON refresh_tokens (family_id);
```

Ships the same way every other table does: `CREATE TABLE IF NOT EXISTS` in
`schemaSql`, applied on `next start` boot (dev, test/`pg-mem`, and prod after the
CI deploy restart). No separate migration tooling exists or is needed.
`resetDatabase()` gets a `DELETE FROM refresh_tokens` line for test isolation.

## Rotation & theft detection

`POST /api/auth/refresh` (cookie-authenticated by the refresh cookie, CSRF-checked):

1. Hash the presented refresh token, look up the row.
2. **Not found** → 401 (clear cookies). Unknown/forged token.
3. **Found but `revoked_at` set** → this is a *reused, already-rotated* token →
   **token theft**: revoke the entire `family_id` (all sessions in that lineage)
   and 401. This is the standard refresh-rotation breach response.
4. **Found, live, not expired** → issue a new access token + a new refresh token
   in the **same family**, mark the old row `revoked_at = NOW()`,
   `replaced_by = <new id>`. Set both cookies. Return `{ user }`.
5. **Expired** → 401, clear cookies.

Logout (`POST /api/auth/sign-out`): revoke the presented refresh row (and its
family). "Sign out everywhere" (`POST /api/auth/sign-out-all`,
authenticated): revoke all rows for `user_id`. Access token still lives ≤15 min
by design — acceptable, that is the point of keeping it short.

## Backend changes (`blog-app-mui-backend`)

New / changed files:

- `src/lib/jwt.ts` — access TTL becomes 15m; add `JWT_REFRESH_EXPIRES_IN`
  (default `30d`). Keep `signToken`/`verifyToken`.
- `src/lib/cookies.ts` **(new)** — `serializeAuthCookies(res, { accessToken,
  refreshToken, csrfToken }, req)`, `clearAuthCookies(res, req)`,
  `readCookie(req, name)`. Decides `Secure`/`SameSite` from req (prod vs dev).
  Small, pure, unit-tested. No external cookie lib — hand-rolled `Set-Cookie`
  strings (the Yandex OAuth flow already sets cookies by hand, same pattern).
- `src/lib/csrf.ts` **(new)** — `generateCsrfToken()`, `csrfValid(req)`
  (double-submit: `csrf_token` cookie must equal `x-csrf-token` header,
  constant-time compare via existing `crypto.timingSafeEqual` pattern).
- `src/models/RefreshToken.ts` **(new)** — Mongoose-style façade over `dbQuery`
  in the exact style of `User.ts`: `create`, `findByHash`, `revoke(id)`,
  `revokeFamily(familyId)`, `revokeAllForUser(userId)`, `rotate(oldRow, …)`.
- `src/services/auth.ts` — `signIn` now also mints a refresh token (persists a
  `refresh_tokens` row) and returns `{ accessToken, refreshToken, csrfToken,
  user }`. Add `refresh(rawToken, userAgent)` and `revoke(...)` helpers, or a
  sibling `refreshService` — kept small, one responsibility each.
- `src/middlewares/require-auth.ts` — read the access token from the
  `access_token` **cookie** first; keep `Authorization: Bearer` as a fallback so
  the **bot service-token path is 100% unchanged** (the bot sends
  `Bearer BOT_API_TOKEN`, never a cookie). Order: bearer-bot-token →
  cookie-JWT → bearer-JWT fallback.
- `src/middlewares/with-csrf.ts` **(new)** — `withCsrf(handler)` composable;
  enforces `csrfValid` on POST/PUT/PATCH/DELETE. Applied to state-changing,
  cookie-auth routes. **Not** applied to the bot path (bot uses a bearer token,
  not a cookie → not CSRF-exposed; the middleware skips when the request carries
  a valid non-cookie bearer or no cookie at all).
- Routes:
  - `sign-in.ts` — set cookies from the service result instead of returning the
    token in JSON. Still return `{ user }` (drop `accessToken` from the body).
  - `sign-out.ts` **(new)** — revoke + clear cookies.
  - `sign-out-all.ts` **(new)** — revoke all for user + clear cookies.
  - `refresh.ts` **(new)** — the rotation endpoint above, rate-limited.
  - `google/callback.ts`, `yandex/callback.ts` — **stop putting the token in the
    URL**. Mint access+refresh, set cookies, then redirect to
    `${FRONTEND_URL}/auth/success` **with no query token**. The success page just
    calls `/me`.
  - `google.ts`, `yandex.ts` (OAuth *start*) — unchanged.
- CORS: already sends `Access-Control-Allow-Credentials: true` for allow-listed
  origins (`middleware.ts`, `cors.ts`). Add `X-CSRF-Token` to the allowed
  request headers (`Access-Control-Allow-Headers`).
- Update the now-stale comment in `admin/bot/model.ts` ("Admin auth is bearer-JWT
  (not cookie) so these POSTs are not CSRF-exposed") — admin UI calls now use
  cookies + CSRF; the bot path is what stays bearer/CSRF-free.

## Frontend changes (`blog-app-mui-frontend`)

The token is currently threaded as `user.accessToken` through ~7 admin/bot/system
SWR hooks and read from `sessionStorage` in `post-comment-form`. With httpOnly
cookies **JS can no longer read the token**, so all of that must change to
"cookie travels automatically":

- `src/utils/axios.ts` — `axios.create({ baseURL, withCredentials: true })` so
  every request sends cookies. Add a request interceptor that attaches the
  `X-CSRF-Token` header (read from the `csrf_token` cookie) on mutating methods.
  Add a **response interceptor**: on `401`, call `/api/auth/refresh` once and
  retry the original request; if refresh fails, hard sign-out. (Single-flight:
  concurrent 401s share one refresh promise.)
- `src/auth/context/jwt/utils.ts` — `setSession` no longer writes
  `sessionStorage` or sets `axios.defaults.headers.Authorization`. Session state
  is now "does `/me` succeed". `isValidToken` (client-side JWT decode) is
  removed — the client can't read the token and shouldn't gate on it; the server
  is the authority. `tokenExpired`/`alert` timer removed (the axios refresh
  interceptor handles expiry transparently).
- `src/auth/context/jwt/action.ts` — `signInWithPassword` posts creds, then
  calls `checkUserSession` (cookies already set by the response). `signOut`
  calls `POST /api/auth/sign-out` (server revokes) then clears local user state.
- `src/auth/context/jwt/auth-provider.tsx` — `checkUserSession` drops the
  `sessionStorage` read; just calls `/me`. On success → authenticated; on 401 →
  the axios interceptor tries refresh first, so a returning user with a valid
  refresh cookie is silently restored. `user.accessToken` is removed from state.
- The ~7 hooks (`actions/admin.ts`, `actions/bot.ts`, `actions/system-metrics.ts`,
  `revalidate-posts.ts`) and their callers (`admin-*`, `bot-*`, `system-*`
  sections) — **stop building `Authorization: Bearer ${accessToken}` headers**;
  the cookie carries auth now. The `accessToken`-as-SWR-key trick (used to defer
  a request until login) is replaced by gating on `authenticated`/`user` from
  the auth context (e.g. key is `null` until `authenticated`).
- `post-comment-form.tsx` — drop the `sessionStorage.getItem(STORAGE_KEY)` read;
  rely on the cookie. Keep the "must be logged in" UX by checking the auth
  context instead.
- `src/app/api/revalidate/route.ts` — this Next route currently forwards the
  incoming `Authorization` header to the backend. Switch it to forward the
  request cookies (the admin's `access_token`) so the backend still authorizes
  the revalidate call.
- `src/app/auth/success/page.tsx` — no longer reads `?token=`. Just
  `await checkUserSession()` (cookies are already set by the callback redirect)
  and redirect. Show an error only if `/me` fails.
- `STORAGE_KEY` / `constant.ts` — removed (no more sessionStorage key). Grep
  confirms `STORAGE_KEY` from the auth module is used only by auth code +
  `post-comment-form`; the settings/notifications `STORAGE_KEY`s are unrelated
  and untouched.

## Data flow (after)

1. **Login:** FE `POST /sign-in` (creds) → BE verifies, mints access+refresh,
   inserts refresh row, sets 3 cookies, returns `{ user }` → FE `checkUserSession`
   → `/me` (cookie) → authenticated.
2. **Authed request:** axios sends `access_token` cookie automatically +
   `X-CSRF-Token` header on mutations → `require-auth` reads cookie → handler.
3. **Access expiry (15 min):** request 401s → axios interceptor `POST /refresh`
   (refresh cookie + CSRF) → BE rotates, sets new cookies → axios retries
   original → success. Transparent to the user.
4. **OAuth:** provider → BE callback mints access+refresh, sets cookies,
   redirects to `/auth/success` (no token in URL) → FE `/me` → authenticated.
5. **Logout:** FE `POST /sign-out` → BE revokes family, clears cookies → FE drops
   user state.
6. **Theft:** stolen refresh token used after the real client already rotated →
   BE sees a revoked row reused → revokes the whole family → both parties 401 →
   re-login required. Stolen *access* token dies within 15 min regardless.

## Error handling

- Missing/invalid access cookie on a protected route → 401 (unchanged behaviour,
  new source).
- Refresh: not-found / expired → 401 + clear cookies; reused-revoked → 401 +
  family revoke. FE treats any refresh 401 as "session over" → sign-out + route
  to sign-in.
- CSRF mismatch on a mutation → 403. FE surfaces the axios error normally.
- Backend DB error inserting a refresh row during login → login fails cleanly
  (500 via `sendError`), no half-state (no cookies set).
- All new cookie/CSRF/refresh code fails **closed** (deny on any doubt).

## Testing

Backend (Jest + Supertest + `pg-mem`, `NODE_ENV=test`):
- `cookies` helper: prod vs dev attribute matrix (Secure/SameSite).
- `csrf`: valid pair passes; missing header, mismatched value, missing cookie all
  fail; constant-time compare used.
- `RefreshToken` model: create/find-by-hash/revoke/revoke-family/revoke-all.
- `sign-in`: sets 3 cookies, body has `user` and **no** `accessToken`; refresh
  row persisted (hashed, not raw).
- `refresh`: happy rotation (old revoked, new issued, cookies rotated); reused
  revoked token → family revoked + 401; expired → 401; forged → 401. CSRF
  enforced.
- `sign-out` / `sign-out-all`: rows revoked, cookies cleared.
- `require-auth`: cookie-JWT path authenticates; **bot bearer path still works
  unchanged**; bearer-JWT fallback works.
- Existing auth/admin/post tests updated to send the access cookie (+ CSRF on
  mutations) instead of `Authorization: Bearer` where they were cookie-less.

Frontend (Vitest + Playwright e2e):
- Unit: axios CSRF-header attach on mutations; 401→refresh→retry interceptor
  (single-flight); `setSession` no longer touches sessionStorage.
- e2e: login → cookie set (httpOnly, not readable via `document.cookie`) →
  authed page loads; logout → protected route redirects; **no token in any URL**
  across the OAuth success route; expired-access silent refresh keeps the user in.

## Rollout / compatibility

- **Deploy backend first** (it accepts *both* cookie and legacy bearer during the
  window), then frontend. So a mid-deploy mismatch never locks users out:
  - Old FE (bearer) + new BE → bearer fallback still authenticates. ✔
  - New FE (cookie) + old BE → would break; hence BE goes first. The BE change is
    strictly additive (adds cookie reading, keeps bearer), so old FE keeps working
    until the new FE ships.
- Existing logged-in users: their old `sessionStorage` token is simply ignored by
  the new FE; first `/me` 401 → refresh (no refresh cookie yet) → clean sign-out →
  they log in once and get cookies. Acceptable one-time re-login.
- Schema: `refresh_tokens` auto-creates on the BE restart after CI deploy.

## Out of scope (YAGNI)

- No `better-auth` / framework swap.
- No moving off JWT to opaque server sessions for the *access* token (refresh is
  server-side; access stays a short JWT — good balance, no per-request DB hit).
- No device/session-management UI beyond "sign out everywhere" (can come later;
  the `user_agent` column is stored to enable it).
- No password-policy / 2FA / OAuth-provider changes — separate concerns.

## Explicitly preserved

- bcrypt hashing, failed-attempt lockout, email-verification gate, fail-fast
  `JWT_SECRET`, per-IP rate-limit, RBAC (`require-admin`), audit logging, the bot
  service-token path, and the constant-time compare helper — all untouched in
  behaviour.

## Implementation refinements (better than the original plan)

Two decisions during build improved on the plan; both are reflected in the code:

1. **CSRF is enforced centrally inside `requireAuth`, not per-route.** The plan
   had a `withCsrf` wrapper applied to each mutating route (~28 files, easy to
   forget on the next new route). Instead, `requireAuth` enforces the double-submit
   check itself: when a request authenticates via the **cookie** path AND the
   method is mutating, `csrfValid(req)` must pass; the bearer (bot/legacy) path is
   exempt because it authenticates before the check. Every cookie-auth mutation is
   protected automatically. `withCsrf` is kept only for the two standalone auth
   routes that don't use `requireAuth` (`refresh`, `sign-out`). Bonus: existing
   tests authenticate with `Authorization: Bearer` → bearer path → CSRF-exempt, so
   **zero existing tests needed changes** (377 backend tests still green).

2. **Cross-subdomain cookie sharing via `COOKIE_DOMAIN`.** Prod runs FE
   (`aifirst.us.com`) and API (`api.aifirst.us.com`) on sibling subdomains. The FE's
   own `/api/revalidate` route needs to prove admin to the backend, but a
   same-origin browser request to the FE origin wouldn't carry an API-origin
   cookie. Setting `COOKIE_DOMAIN=.aifirst.us.com` (new env; unset in dev → host-only)
   shares the auth cookies across both subdomains, so `/api/revalidate` forwards the
   request's `Cookie` header to the backend `/me`. This also keeps the admin-JWT
   revalidate model with no static shared secret. `access_token` cookie stays
   `Path=/`; `refresh_token` stays `Path=/api/auth`.
   **Prod deploy note:** set `COOKIE_DOMAIN=.aifirst.us.com` in the backend
   `.env.production`. Without it, cookies are host-only and the "Обновить кеш"
   admin button (only that feature) can't authorize — everything else still works.

Also added (small, high-value): a **"Выйти на всех устройствах"** link in the
account drawer that calls `POST /api/auth/sign-out-all`, making the server-side
revocation visible/usable (was left as a bare endpoint in the plan).

## Verification (all green)

Backend: `tsc` clean (only pre-existing `passport.ts` `@types` gaps, identical on
`main`), lint clean, **377/377 Jest tests pass** incl. 32 new
(cookie-attr matrix, CSRF double-submit, refresh hashed-not-raw, rotation, reuse→
family-revoke theft, cookie-auth CSRF enforce/allow, bearer back-compat).

Frontend: `next build` green, `tsc` clean, lint clean, `knip` clean (no new
orphans), **160/160 Vitest tests pass** (+6 new CSRF-cookie helper).

Live browser (Playwright, real Postgres, FE→BE over localhost):
- Login → `/dashboard`; **`document.cookie` shows only `csrf_token`** —
  `access_token`/`refresh_token` invisible to JS (httpOnly), `sessionStorage`
  empty, `localStorage` has no token, **URL has no token**.
- Cookie auth: `/me` and `/api/admin/audit-logs?limit=5` → 200 with data; admin
  audit-logs page renders fully (screenshot captured).
- CSRF: mutation without `X-CSRF-Token` → 403; with it → passes the gate.
- Refresh: valid → 200 + rotated token; reused rotated-out token → 401 (family
  revoked).
- OAuth callbacks redirect to bare `/auth/success` (no `?token=` anywhere).
- Logout: `POST /sign-out` → 200, then `/me` → 401, `document.cookie` empty.
