# LLM Usage Dashboard — Design Spec

**Date:** 2026-06-21
**Status:** Approved design, pre-implementation
**Owner:** talalaev-m

## Problem

I use multiple AI coding harnesses (Claude Code, Codex, OpenCode, Cursor, and
occasionally others). Each writes conversation/usage logs **locally** on my mac.
I want one beautiful dashboard that answers: **how often do I use AI, which
harnesses, which models, when, on which projects, and at what (estimated) cost** —
built entirely from local data, no external API required for V1.

## Goals

- Aggregate local usage logs across harnesses into one normalized dataset.
- Render a polished MUI/ApexCharts dashboard inside the existing blog frontend.
- Make it **trivial to add a new harness** (one adapter file, no UI change).
- Be correct about token counts (dedup; no double counting).
- Fast rescans via an incremental file/offset cache.
- After each build task, surface one concrete improvement/automation idea.

## Non-Goals (V1)

- No server-side / prod hosting of the data (data lives on the mac only).
- No ChatGPT token stats (no local token data exists — would mislead).
- No Cursor server Admin API call in V1 (optional V2; needs a team admin key).
- No write access to any harness log. **Read-only** everywhere.

## Ground Truth (verified on this machine, 2026-06-21)

Probed local disk + cross-checked against OSS analyzers (ccusage et al.).

| Harness         | Installed here                              | Path                                                                                                | Format         | model                                             | tokens                                                                                                                                                  | ts                              | cwd                          | Difficulty                    |
| --------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------------------- | ----------------------------- |
| **Claude Code** | ✅ 639 files, 16 projects, 2026-05-22→06-21 | `~/.claude/projects/<slug>/<sessionId>.jsonl`                                                       | jsonl          | `message.model`                                   | `message.usage.{input_tokens,output_tokens,cache_creation_input_tokens,cache_read_input_tokens}`                                                        | top-level `timestamp`           | top-level `cwd`              | **easy**                      |
| **Codex**       | ✅ 72 files, from 2026/06/16                | `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`                                                      | jsonl          | `turn_context.payload.model`                      | `event_msg` type `token_count` → `payload.info.total_token_usage.{input_tokens,cached_input_tokens,output_tokens,reasoning_output_tokens,total_tokens}` | line `timestamp`                | `session_meta.payload.cwd`   | **easy-med**                  |
| **OpenCode**    | ✅ sqlite, 104 msgs                         | `~/.local/share/opencode/opencode.db` → table `message`, JSON in `data`                             | sqlite+json    | `data.modelID`+`providerID` (or nested `model`)   | `data.tokens.{input,output,reasoning,cache:{read,write}}`                                                                                               | `data.time.{created,completed}` | `data.path.cwd`              | **medium**                    |
| **Cursor**      | ✅ 932MB                                    | `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb` → `cursorDiskKV` `bubbleId:*` | sqlite-kv+json | `modelInfo.modelName` / `lastUsedModel` (partial) | `tokenCount.{inputTokens,outputTokens}` (partial, no cache, unreliable)                                                                                 | `createdAt` (epoch ms)          | indirect (workspace DB path) | **hard**                      |
| Gemini CLI      | ❌                                          | `~/.gemini/tmp/<hash>/chats/session-*.jsonl`                                                        | jsonl          | `model`                                           | `tokens.{input,output,cached,total}`                                                                                                                    | `timestamp`                     | `directories[]`              | easy (if installed)           |
| Continue        | ❌                                          | `~/.continue/dev_data/0.2.0/tokensGenerated.jsonl`                                                  | jsonl          | `model`                                           | `promptTokens`,`generatedTokens`                                                                                                                        | `timestamp`                     | none                         | easy (if installed)           |
| Goose           | ❌                                          | `~/.local/share/goose/sessions/sessions.db`                                                         | sqlite         | `provider_name`+json                              | `input_tokens`,`output_tokens`,`cache_*`                                                                                                                | `created_at`                    | `working_dir`                | medium (if installed)         |
| Copilot CLI     | ❌                                          | `~/.copilot/session-state/<id>/events.jsonl`                                                        | jsonl          | `modelMetrics` key                                | `modelMetrics.<m>.usage.inputTokens` (shutdown agg)                                                                                                     | line `timestamp`                | repo/branch                  | hard, unstable (if installed) |
| **ChatGPT**     | ❌                                          | export `conversations.json`                                                                         | json           | `model_slug`                                      | **none**                                                                                                                                                | `create_time`                   | none                         | **no tokens — excluded**      |

**Correctness traps (both research streams flagged these):**

- **Claude Code:** records repeat — **dedup by `message.id` / `requestId`**. `input/output_tokens` can undercount; cache fields are accurate.
- **Codex:** `total_token_usage` is **cumulative per session** — diff consecutive `token_count` events or use `last_token_usage` for per-turn deltas. Subagent rollouts replay parent history → dedup or overcount (ccusage saw up to 91×). Model lives on `turn_context`, tokens on a later `token_count` event — **join token_count → preceding turn_context within a file.**
- **Codex `~/.codex/logs_*.sqlite`** are app trace logs, NOT usage — ignore them.
- **OpenCode / Goose:** detect JSON-file vs SQLite layout at runtime (varies by version).
- **Cursor:** local tokens are a lower bound, not a ledger; authoritative source is the server Admin API. V1 reports Cursor as best-effort/partial and labels it as such.

## Placement Decision

**Local-first admin page inside the blog frontend.**

- Route: `/dashboard/admin/llm-stats` — matches existing `/dashboard/admin/{audit-logs,posts,users}` pattern (page.tsx + `src/sections/admin/*-view.tsx`).
- Behind the existing admin guard (`RoleBasedGuard` / admin role).
- A **local Next API route** `/api/llm-stats` does the filesystem parsing (Node `fs`,
  `better-sqlite3`). It works under `npm run dev` on the mac. On the prod VDS there is
  no `~/.claude` data, so it returns an empty dataset with a clear "no local data on
  this host" notice. The page renders the same either way.
- **Rejected — standalone tool:** would duplicate theme, charts, guard, dev server.
- **Rejected — pure prod page:** data never reaches the VDS; impossible to render there.

This ships as a real, theme-consistent feature, reusing existing infra, while keeping
all data on the local machine.

## Architecture

Three layers. Each layer is independently testable.

```
┌─ SOURCE ADAPTERS ─┐   ┌─ NORMALIZE ─┐   ┌─ AGGREGATE + UI ──────────┐
│ claudeCode.scan() │   │             │   │ /api/llm-stats (Node)     │
│ codex.scan()      │ → │ UsageEvent  │ → │  → aggregate(events)      │
│ opencode.scan()   │   │  (unified)  │   │  → JSON                   │
│ cursor.scan()     │   │             │   │ section view (MUI/Apex)   │
└───────────────────┘   └─────────────┘   └───────────────────────────┘
```

### Layer 1 — Source adapters

Location: `src/server/llm-stats/adapters/<harness>.ts` (server-only; never imported
by client bundle). Each adapter:

```ts
export interface SourceAdapter {
  harness: HarnessId; // 'claude-code' | 'codex' | ...
  isAvailable(): boolean; // does the data dir exist on this host?
  scan(since?: number): UsageEvent[]; // since = mtime cursor for incremental
}
```

- `isAvailable()` gates everything — on prod VDS all return false → empty dataset.
- `scan()` streams files line-by-line (readline / sqlite cursor), never loads whole
  files (639 CC files; 932MB Cursor DB).
- Each adapter owns its dedup logic and emits already-deduped `UsageEvent[]`.

Adding a harness = add one adapter file + register it in the adapter list. No other
layer changes.

### Layer 2 — Unified event

```ts
type HarnessId =
  | "claude-code"
  | "codex"
  | "opencode"
  | "cursor"
  | "gemini"
  | "continue"
  | "goose"
  | "copilot";

interface UsageEvent {
  harness: HarnessId;
  provider: string; // 'anthropic' | 'openai' | 'zhipu' | ...
  model: string; // raw id: 'claude-opus-4-8'
  modelFamily: string; // normalized: 'opus' | 'sonnet' | 'gpt-4o' | 'glm'
  ts: string; // ISO-8601
  dateKey: string; // 'YYYY-MM-DD' (local) for day buckets
  hour: number; // 0-23 local, for heatmap
  project: string | null; // basename(cwd)
  tokensIn: number;
  tokensOut: number;
  cacheRead: number;
  cacheWrite: number;
  reasoning: number; // 0 when N/A
  costUsd: number | null; // computed in aggregate, null if model unpriced
  // optional harness-specific extras (Claude Code only today):
  sessionId?: string;
  gitBranch?: string | null;
  skill?: string | null; // attributionSkill
  mcpTool?: string | null; // attributionMcpTool
  agent?: string | null; // attributionAgent (subagent fan-out)
}
```

Model normalization: a small `modelFamily(rawId)` map (+ regex fallback) collapses
`claude-opus-4-8`, `anthropic/claude-4.8-opus-20260528` → `opus`, etc.

### Layer 3 — Aggregate + UI

`aggregate(events): StatsBundle` (pure function, fully unit-tested) produces every
widget's data in one pass:

```ts
interface StatsBundle {
  kpis: { totalTokens; totalCostUsd; sessions; activeDays; topModelFamily; topHarness };
  byModelFamily: { family; tokens; requests; costUsd }[];
  byModel: { model; provider; tokensIn; tokensOut; cacheRead; cacheWrite; requests; costUsd }[];
  byHarness: { harness; tokens; requests; costUsd }[];
  byProject: { project; tokens; requests }[];      // top N
  trend: { dateKey; tokens; costUsd; byHarness: Record<HarnessId, number> }[];
  heatmap: { day: 0-6; hour: 0-23; tokens }[];      // weekday × hour
  claudeExtras: { topSkills; topMcpTools; cacheHitRatio; agentFanout } | null;
  meta: { generatedAt; scannedFiles; harnessesAvailable; warnings: string[] };
}
```

`warnings` carries things like "Cursor tokens are partial/local-only" so the UI can
show honest caveats.

### Incremental cache

- `~/.cache/llm-stats/index.json`: per source file → `{ mtime, sizeBytes, lastOffset }`
  - the accumulated deduped event store (or a compact rollup).
- First scan: full. Later scans: only files whose `mtime`/size changed, read from
  `lastOffset` forward. Pattern borrowed from `phuryn/claude-usage`.
- Cache is disposable: delete the dir → next scan rebuilds.

### Cost estimation

- `src/server/llm-stats/pricing.ts`: `{ [modelFamilyOrId]: { in, out, cacheRead, cacheWrite } }`
  in USD per 1M tokens. Editable JSON-ish constant.
- `costUsd = (tokensIn*in + tokensOut*out + cacheRead*cacheRead + cacheWrite*cacheWrite)/1e6`.
- Unpriced model → `costUsd = null`, excluded from cost totals, surfaced in `warnings`.
- UI labels all money as **"estimate"**.

## Dashboard Widgets

`/dashboard/admin/llm-stats`, section `src/sections/admin/llm-stats/`:

1. **Hero KPI row** — total tokens, est. cost, sessions, active days, top model, top harness.
2. **Model split** — ApexCharts donut by `modelFamily`; companion bar (tokens by raw model).
3. **Harness split** — donut/bar: which tool you lean on.
4. **Trend over time** — stacked area: tokens (and cost toggle) per day, stacked by harness.
5. **Activity heatmap** — weekday × hour grid (ApexCharts heatmap), tokens intensity.
6. **Top projects** — horizontal bar, tokens by project (Claude Code `cwd`).
7. **Claude Code deep cuts** (only when CC data present): top skills, top MCP tools,
   cache-hit ratio gauge, agent fan-out count.
8. **Detailed model table** — per model: requests, in/out/cache tokens, est. $.
9. **Honesty banner** — lists which harnesses contributed, which are partial, and the
   "estimates" caveat. Empty-state when no local data (prod).

## Component / File Layout

```
src/server/llm-stats/
  types.ts                     # UsageEvent, HarnessId, StatsBundle, SourceAdapter
  pricing.ts                   # price table + costFor()
  normalize.ts                 # modelFamily(), provider(), project()
  aggregate.ts                 # aggregate(events) -> StatsBundle  (pure, tested)
  cache.ts                     # incremental file/offset index
  scan.ts                      # runs all available adapters -> UsageEvent[]
  adapters/
    claude-code.ts
    codex.ts
    opencode.ts
    cursor.ts                  # V2, best-effort
    stubs.ts                   # gemini/continue/goose/copilot (activate if dir exists)
src/app/api/llm-stats/route.ts # GET -> StatsBundle (or empty on prod)
src/app/dashboard/admin/llm-stats/page.tsx
src/sections/admin/llm-stats/
  llm-stats-view.tsx           # composes widgets
  const.ts                     # widget config, colors
  types.ts                     # view-prop types
  utils.ts                     # sx mappers, number/byte formatters
  widgets/                     # one file per chart/card
```

Boundaries: `src/server/llm-stats/*` is pure data, no React, no MUI — unit-testable in
isolation. The section is pure presentation, fed `StatsBundle` via the API route.

## Data Flow

1. Page (client) → SWR `useGetLlmStats()` → `GET /api/llm-stats`.
2. Route (server, mac) → `scan()` (incremental) → `aggregate()` → `StatsBundle` JSON.
3. On prod VDS: `isAvailable()` all false → `StatsBundle` with empty arrays +
   `warnings: ['no local harness data on this host']`. Page shows empty state.

## Error Handling

- A corrupt/partial line in any jsonl → skip that line, count it in `meta.warnings`,
  never abort the scan.
- A missing harness dir → adapter `isAvailable()` false, silently skipped.
- SQLite open failure (locked Cursor DB) → adapter returns `[]` + a warning.
- Unpriced model → `costUsd=null`, excluded from cost, surfaced.
- Route never throws to the client; always returns a valid `StatsBundle`.

## Testing

- **Adapters:** fixture files (a few real-shaped jsonl lines + a tiny sqlite) →
  assert emitted `UsageEvent[]`, including dedup (CC repeated `message.id`; Codex
  cumulative-diff; Codex subagent replay).
- **normalize/pricing:** table-driven unit tests (raw id → family; cost math).
- **aggregate:** golden test — known event list → exact `StatsBundle`.
- **route:** returns empty bundle when adapters unavailable.
- Frontend follows repo rules: RHF/Zod not needed (read-only), kebab files, MUI `sx`,
  no `as`/`any`, string params as unions/enums.

## Build Tiers

- **V1 (now):** Claude Code, Codex, OpenCode adapters + full pipeline + UI + cache.
- **V2:** Cursor adapter (local best-effort) + optional Cursor Admin API behind an env key.
- **V3:** stub adapters for Gemini/Continue/Goose/Copilot that auto-activate if their
  dir appears. ChatGPT intentionally excluded (no local tokens).

## Per-Task Improvement Hook

After each implementation task, propose exactly one concrete improvement or
automation, e.g.: incremental-cache cron refresh; `chokidar` watch mode; CSV/JSON
export; weekly email digest via the backend's existing Nodemailer; a `/dashboard`
KPI teaser card; OpenTelemetry ingestion as an alternative CC source.

## Open Risks

- Cursor `cursorDiskKV` and Copilot `events.jsonl` schemas are undocumented and shift
  between releases — parse defensively, treat as best-effort, never block the pipeline.
- Cost numbers are estimates only (no provider billing API in V1).
- Local-only: nothing renders on prod by design.

```

```
