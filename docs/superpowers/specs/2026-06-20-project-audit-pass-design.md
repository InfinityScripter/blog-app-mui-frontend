# Project Audit Pass — Design

Date: 2026-06-20
Repos: `blog-app-mui-frontend` (worktree) + `blog-app-mui-backend`

## Goal

Fix 8 distinct issues found in a project walk-through: auth UX bugs, broken
avatar rendering, mock sidebar content, non-functional news tabs, missing
profile page, comment non-reactivity, and a logo refresh. Portfolio refresh is
deferred to the end of the session pending real content from the user.

## Work Items

### 1. Auth fields empty (frontend)

**Problem:** Sign-in form pre-fills `demo@minimals.cc` / `@demo1` via
`defaultValues`, plus an info `<Alert>` advertising them. Sign-up pre-fills
`Hello`/`Friend`/`hello@gmail.com`/`@demo1`.

**Fix:**

- `src/sections/auth/jwt/jwt-sign-in-view.tsx`: `defaultValues = { email: "", password: "" }`; remove the demo-credentials `<Alert severity="info">` (lines ~207-211).
- `src/sections/auth/jwt/jwt-sign-up-view.tsx`: clear all `defaultValues` to `""`.

### 2. Yandex sign-in icon (frontend)

**Problem:** Yandex button uses `Iconify icon="simple-icons:yandex"`, which
renders blank/invisible (monochrome `currentColor`, may be absent from the
loaded Iconify set). Backend Yandex OAuth callback works.

**Fix:** Render a reliable branded Yandex mark. Add a `yandex` case to
`src/components/iconify/social-icon.tsx` (inline branded SVG — red square with
white `Я`), use `<SocialIcon icon="yandex" />` in both jwt sign-in and sign-up
buttons. Keep Google as `flat-color-icons:google` (verified working). Verify in
browser that the glyph is visible in both light and dark mode.

### 3. Real avatar rendering (frontend, BUG)

**Problem:** Backend `/api/auth/me` returns `{ name, email, avatarURL, role }`
(see `public-user.ts`). The dashboard layout reads `user.photoURL` and
`user.displayName`, which do not exist on the real `User` → avatar always falls
back to the silhouette, even for Google/Yandex users who have an avatar.

**Fix (read-site mapping):**

- `src/layouts/components/account-drawer.tsx`: build `userView` from the real
  user — `photoURL: user?.avatarURL`, `displayName: user?.name`.
- `src/layouts/components/account-button.tsx`: callers already pass `photoURL`/
  `displayName`; ensure the drawer passes the mapped values.
- Confirm `LayoutUserView` usage still type-checks (it has optional fields).

### 4. Sidebar strip to real items (frontend)

**Problem:** `config-nav-account.tsx` ships 6 items, 5 with `href="#"`
(Profile/Projects/Subscription/Security/Account settings), English labels.
`account-drawer.tsx` renders a 3-avatar mock switcher, an "Add account" button,
and an `UpgradeBlock` (upgrade-to-Pro CTA).

**Fix (decision: strip to real items only):**

- `config-nav-account.tsx`: keep `Home` and `Profile` (Profile → real
  `paths.dashboard.user.account`). Russian labels: `Главная`, `Профиль`. Drop
  Projects/Subscription/Security/Account settings.
- `account-drawer.tsx`: remove the mock-avatar `Stack` (3 `_mock` avatars +
  "Add account"), remove `<UpgradeBlock />`. Drop now-unused imports
  (`_mock`, `Avatar`, `Tooltip`, `UpgradeBlock`).

### 5. News tabs clickable (frontend)

**Problem:** `news-section-bar.tsx` renders categories (`Главное`, `Технологии`,
`Наука`, `Политика`, `Культура`) as decorative `<Box component="span">` — no
state, no filtering.

**Fix:** Make categories real filters.

- Lift selected-category state into `news-list-view.tsx`.
- `news-section-bar.tsx`: accept `active` + `onSelect` props; render each
  category as a clickable element with active styling (keep current visual
  language, drive colors from theme palette per the sections guideline).
- Filtering: posts carry `tags`. `Главное` shows all news; each other category
  filters news posts whose `tags` include the matching category keyword
  (case-insensitive). If a category has zero matches, show an empty-state line
  rather than a blank feed. Keep it client-side over the already-fetched list.

### 6. Profile page + backend endpoints (BIGGEST)

Decision: implement name + avatar + password.

**Backend (`blog-app-mui-backend`), 3 new auth-guarded endpoints:**

- `PATCH /api/user/profile` — body `{ name }`; updates `users.name`; returns
  `{ user: toPublicUser(...) }`. Guarded by `requireAuth`.
- `POST /api/user/avatar` — sets `avatarURL`. Reuse the existing file-upload
  pipeline: client uploads the image via the existing file endpoint, then this
  endpoint stores the resulting URL on `users.avatar_url`. (If simpler, accept a
  URL in the body after upload.) Returns updated public user.
- `POST /api/user/change-password` — body `{ currentPassword, newPassword }`;
  verify current via bcrypt against the stored hash, reject if wrong (400),
  hash + store new. Guarded by `requireAuth`. Distinct from the existing
  reset-by-code flow (`update-password.ts`).
- Follow existing conventions: `next-connect`, `requireAuth`, response shape
  `{ message, success, data/user }`, `pg` queries in the user model/service.
  Add Jest tests under `src/tests/` using the `pg-mem` harness.

**Frontend:**

- Route: `src/app/dashboard/user/account/page.tsx` (client, AuthGuard via the
  dashboard layout).
- Path constant: add `paths.dashboard.user.account` in `src/routes/paths.ts`.
- Section: `src/sections/account/` with `view/account-view.tsx` + tabbed
  panels: `account-general.tsx` (avatar upload + name), `account-change-password.tsx`.
- Forms: RHF + Zod + `RHF*` field components only. Avatar upload uses the
  existing `Upload`/`RHFUploadAvatar` component.
- API client: add functions in `src/actions/` (or `src/utils/axios.ts`
  `endpoints`): `updateProfile`, `uploadAvatar`, `changePassword`.
- After a successful save, call `checkUserSession()` (auth context) so the
  drawer avatar/name refresh live.

### 7. Comment reactivity (frontend, BUG)

**Problem:** `addComment`/`updateComment`/`deleteComment` in `blog-ssr.ts` do
not revalidate SWR. The views (`post-details-view.tsx`,
`post-details-home-view.tsx`) read `currentPost.comments` from `useGetPost`, but
never pass the `onCommentUpdated` callback into `PostCommentForm`/
`PostCommentList`, and never call `postMutate`. List does not update on
create/edit/delete.

**Fix:**

- Both views: destructure `postMutate` from `useGetPost`; pass
  `onCommentUpdated={postMutate}` to `<PostCommentForm>` and `<PostCommentList>`.
- `PostCommentForm`/`PostCommentItem` already invoke `onCommentUpdated?.()`
  after their mutation succeeds — wiring the prop is enough. Backend returns the
  full updated post, so `mutate()` (revalidate) refreshes the list.
- Confirm both the dashboard view and the public home view are covered.

### 8. Logo / favicon refresh (frontend)

**Problem:** Logo is an inline SVG in `src/components/logo/logo.tsx`; favicon is
`public/favicon.ico` (no `app/icon`). User wants a different, better-fitting mark.

**Fix:** Design a new mark (a clean monogram/glyph for a personal blog +
portfolio). Replace the inline SVG in `logo.tsx`, add `src/app/icon.tsx`
(Next.js icon route) for the favicon, and update `public/favicon.ico` /
`public/logo/*` assets to match. Verify the header logo + browser tab icon.

### Deferred — Portfolio refresh

User will provide real role/projects/bio. Done last in this session. Until
then, leave `home-*/const.ts` + `portfolio/view/const.ts` text untouched.

## Execution Plan (parallel)

Independent frontend edits run as parallel agents in this worktree:
1, 2, 3, 4 (+route stub from 6), 5, 7, 8.

Item 6 splits into two parallel tracks:

- Backend track: 3 endpoints + tests in `blog-app-mui-backend`.
- Frontend track: route + section + API client.

Sidebar Profile link (Item 4) points at the route added in Item 6 — sequence
the path-constant add before/with the sidebar edit.

## Verification

- `npm run lint` + `tsc --noEmit` (frontend); `npm run ts` + `npm test` (backend).
- Browser preview: empty auth fields; visible Yandex glyph; real avatar after
  login; stripped sidebar; clickable news filters; profile save → live update;
  comment create/delete updates instantly; new favicon in tab.
- No new `as`/`any`; string params as unions/enums (per repo TS rules).

## Out of scope

- Per-category news tagging in the backend (use existing tags for now).
- Email change (name only in profile general).
- Multi-account switching (mock switcher removed, not replaced).
