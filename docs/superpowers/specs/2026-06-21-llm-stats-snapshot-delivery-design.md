# LLM Stats — Snapshot Delivery to Prod — Design Spec

**Date:** 2026-06-21
**Status:** Approved design, pre-implementation
**Owner:** talalaev-m
**Builds on:** `2026-06-21-llm-usage-dashboard-design.md` (the local-only dashboard)

## Problem

The LLM-stats dashboard reads harness logs from `~/.claude`, `~/.codex`,
`~/.local/share/opencode` — these exist only on the local mac. On prod (Vercel)
there is no data, so the admin page is empty and useless. We need a way to
**deliver a stats snapshot from the local mac to prod** so the page is meaningful
when viewed at `https://talalaev.su/dashboard/admin/llm-stats`.

## Goals

- Push a computed `StatsBundle` snapshot from the local mac to the backend DB.
- Frontend (local AND prod) reads the snapshot from the backend — one code path.
- Strip project names before pushing (work repos like Arcadia/tef must not leak
  to a public site).
- Updating prod stats = run one local command (optionally scheduled).
- Reuse the existing backend (Postgres + `requireAdmin` route pattern).

## Non-Goals (V1)

- No snapshot history / time-travel — store only the latest snapshot.
- No automatic real-time sync — push is explicit (manual or scheduled).
- No per-project drill-down on prod (project names are stripped).
- No change to how scanning/aggregation works (reuse `src/server/llm-stats/`).

## Decisions (locked)

- **Single source of truth = backend DB.** Frontend always reads the snapshot
  from the backend (`GET /api/admin/llm-stats/snapshot`), both locally and on
  prod. The local file-scanning API route (`/api/llm-stats`) and `better-sqlite3`
  move OUT of the Next app into a standalone CLI script — the Next app no longer
  reads the filesystem at all (also removes the serverless-FS risk entirely).
- **Anonymization: drop `byProject` wholesale** before push. The "Top projects"
  widget simply doesn't render when the array is empty. Everything else (models,
  harnesses, time, cost, skills, MCP tools, cache) is kept.

## Architecture

```
┌─ LOCAL MAC ──────────────────────────────┐     ┌─ BACKEND (VDS) ──────────┐
│ npm run llm-stats:push                    │     │ POST /api/admin/         │
│   scan() ~/.claude … → UsageEvent[]       │     │   llm-stats/snapshot     │
│   aggregate() → StatsBundle               │ ──▶ │   (requireAdmin)         │
│   sanitize() → drop byProject             │ JWT │   upsert llm_stats_      │
│   POST bundle + admin JWT                 │     │   snapshots (JSONB)      │
└───────────────────────────────────────────┘     │                          │
                                                   │ GET /api/admin/          │
┌─ FRONTEND (local + prod) ────────────────┐       │   llm-stats/snapshot     │
│ /dashboard/admin/llm-stats               │ ◀──── │   → latest bundle | null │
│   useGetLlmStats() → backend snapshot     │       └──────────────────────────┘
│   renders widgets (Top-projects hidden)   │
└───────────────────────────────────────────┘
```

### Backend (repo: blog-app-mui-backend)

1. **Table** `llm_stats_snapshots` (in `src/lib/db.ts`, `CREATE TABLE IF NOT
EXISTS` like the others):

   ```sql
   CREATE TABLE IF NOT EXISTS llm_stats_snapshots (
     id           SERIAL PRIMARY KEY,
     bundle       JSONB NOT NULL,
     generated_at TIMESTAMPTZ NOT NULL,   -- bundle.meta.generatedAt
     pushed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   ```

   V1 keeps only the latest row (delete-then-insert, or upsert on a fixed id).

2. **`POST /api/admin/llm-stats/snapshot`** — `requireAuth(requireAdmin(handler))`,
   `cors`, `ok`/`sendError`. Validates the body is a plausible bundle (has
   `kpis`, `meta.generatedAt`), replaces the stored snapshot, emits audit
   (`llm_stats.snapshot_pushed`). Returns `{ pushedAt }`.

3. **`GET /api/admin/llm-stats/snapshot`** — `requireAuth(requireAdmin(handler))`.
   Returns `{ bundle, pushedAt } | { bundle: null }` (404-free: empty is a valid
   "no snapshot yet" state).

4. **Service** `src/services/llm-stats-snapshot.ts` — `saveSnapshot(bundle)` /
   `getLatestSnapshot()`, thin DB wrapper (mirrors `services/bot-control`).

### Frontend (repo: blog-app-mui-frontend)

1. **CLI push script** `scripts/push-llm-stats.ts` (run via `tsx`):
   - `scan()` + `aggregate()` from `src/server/llm-stats/` (unchanged).
   - `sanitizeBundle(bundle)` → returns a copy with `byProject: []`.
   - Read admin JWT (env `LLM_STATS_PUSH_TOKEN`, or login with admin creds via
     the backend `/api/auth/sign-in`).
   - `POST {SERVER_URL}/api/admin/llm-stats/snapshot` with `Authorization: Bearer`.
   - `npm run llm-stats:push` script entry.

2. **Reader hook** `useGetLlmStats()` now fetches the backend snapshot endpoint
   (via the shared axios instance + `endpoints.llmStats.snapshot`), not the
   local route. Returns `bundle | null`.

3. **Remove the local-FS path from the served Next app** (keep it for the CLI):
   - delete `src/app/api/llm-stats/route.ts` — the running app no longer reads
     the filesystem, which also removes the serverless-FS failure mode entirely.
   - `src/server/llm-stats/` stays — the push script imports it.
   - `better-sqlite3` stays in deps (the OpenCode adapter, run by the script,
     needs it) but is now only loaded by the CLI, never inside a Vercel function.
     Add `serverExternalPackages` can be dropped later, but leave it — harmless.

4. **View**: unchanged except it renders from the backend bundle. "Top projects"
   widget renders nothing when `byProject` is empty (guard already trivial). Add
   a "snapshot pushed at <time>" line so staleness is visible.

### Sanitization

`sanitizeBundle(bundle: StatsBundle): StatsBundle` (pure, unit-tested):

- `byProject: []` (drop all project names).
- Keep `byModel`, `byModelFamily`, `byHarness`, `trend`, `heatmap`,
  `claudeExtras` (skills/MCP are not sensitive), `kpis`, `meta`.
- Recompute nothing — just blanks the one sensitive array.

## Data Flow

1. Local: `npm run llm-stats:push` → scan → aggregate → sanitize → POST (admin JWT).
2. Backend: validate → replace `llm_stats_snapshots` row → audit → `{ pushedAt }`.
3. Frontend (anywhere): `GET …/snapshot` → render bundle, or empty-state if null.

## Error Handling

- Push script: clear errors for missing token / network / non-2xx; non-zero exit.
- Backend POST: 400 if body isn't a plausible bundle; 401/403 via guards.
- Backend GET: never 404 — `{ bundle: null }` when empty.
- Frontend: empty-state when `bundle === null` (no snapshot pushed yet); error
  state on fetch failure (already added).

## Testing

- **Backend:** Jest/Supertest — POST requires admin (401/403 paths), POST then
  GET round-trips the bundle, GET empty returns `{ bundle: null }`.
- **Frontend:** unit-test `sanitizeBundle` (byProject emptied, rest intact).
  Hook/view: snapshot bundle renders; null → empty-state.
- Existing `src/server/llm-stats/` tests unchanged.

## Security / Privacy

- Endpoint is admin-only (`requireAdmin`) for both read and write — stats are not
  public even though the site is. (Matches the "admin only" guard already on the
  page.)
- Project names never leave the mac (`sanitizeBundle` runs before POST).
- Push token: a long-lived admin JWT in a local env var, never committed.

## Rollout

1. Backend first: table + endpoints + service + tests → merge → deploys to VDS.
2. Frontend: push script + reader hook + remove local route → merge → Vercel.
3. Run `npm run llm-stats:push` once → prod page shows real (project-stripped) stats.
4. Optional: a `launchd`/cron entry to push daily.

## Open Risks

- Snapshot staleness: prod shows whenever you last pushed — surfaced via
  "pushed at" line. Acceptable for a personal dashboard.
- The push token is a standing admin credential on the mac — keep it in env, not
  in the repo.

```

```
