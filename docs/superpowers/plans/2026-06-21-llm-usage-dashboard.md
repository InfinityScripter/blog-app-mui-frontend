# LLM Usage Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first admin dashboard at `/dashboard/admin/llm-stats` that aggregates AI-coding-harness usage logs (Claude Code, Codex, OpenCode) from disk into one normalized dataset and renders model/harness/time/project/cost stats with MUI + ApexCharts.

**Architecture:** Three layers. (1) Server-only **source adapters** (`src/server/llm-stats/adapters/*`), one per harness, each normalizing raw logs into a unified `UsageEvent[]`. (2) A pure **aggregate** function turning events into a `StatsBundle`. (3) A Next.js App Router **API route** (`/api/llm-stats`) that scans + aggregates, plus an **admin section** that renders the bundle. All parsing is read-only and streamed; nothing renders on prod (no data there).

**Tech Stack:** Next.js 15 App Router route handler (Node runtime), `better-sqlite3` (OpenCode/Cursor), Node `readline` (jsonl), TypeScript (strict — no `as`, no `any`, string params as unions), Jest-free repo so tests use the frontend's existing test setup (Playwright is e2e only; unit tests via a new lightweight `vitest` is out of scope — see Task 0 decision), SWR + MUI v7 + ApexCharts.

> **Testing note:** the frontend has no unit-test runner today (only Playwright e2e). To keep the pure logic (adapters, normalize, aggregate, pricing) tested without dragging in a full runner, this plan adds **Vitest** scoped to `src/server/llm-stats/**`. It runs in Node, imports nothing from React, and is fast. If the user prefers no new runner, the alternative is to validate via a throwaway `tsx` script — but Vitest is the recommended path and is assumed below.

---

## File Structure

```
src/server/llm-stats/
  types.ts              # UsageEvent, HarnessId, StatsBundle, SourceAdapter, PriceTable
  normalize.ts          # modelFamily(), providerOf(), projectOf(), dateParts()
  pricing.ts            # PRICE_TABLE + costFor(event)
  aggregate.ts          # aggregate(events) -> StatsBundle  (pure)
  cache.ts              # incremental file index (mtime/size/offset) read+write
  scan.ts               # runAllAdapters() -> UsageEvent[] (uses cache)
  adapters/
    claude-code.ts      # scanClaudeCode()
    codex.ts            # scanCodex()
    opencode.ts         # scanOpenCode()
  __tests__/
    normalize.test.ts
    pricing.test.ts
    aggregate.test.ts
    claude-code.test.ts
    codex.test.ts
    opencode.test.ts
    fixtures/           # tiny real-shaped log files
src/app/api/llm-stats/route.ts        # GET -> StatsBundle JSON
src/app/dashboard/admin/llm-stats/page.tsx
src/actions/llm-stats.ts              # useGetLlmStats() SWR hook
src/sections/admin/llm-stats/
  llm-stats-view.tsx
  const.ts
  types.ts
  utils.ts
  widgets/
    kpi-row.tsx
    model-split-chart.tsx
    harness-split-chart.tsx
    trend-chart.tsx
    activity-heatmap.tsx
    top-projects-chart.tsx
    claude-extras.tsx
    model-table.tsx
    honesty-banner.tsx
```

Modified existing files: `src/routes/paths.ts`, `src/layouts/config-nav-dashboard.tsx`, `package.json`, `vitest.config.ts` (new).

---

## Task 0: Tooling setup (sqlite dep + Vitest scoped to server logic)

**Files:**

- Modify: `package.json` (deps + scripts)
- Create: `vitest.config.ts`

- [ ] **Step 1: Install runtime + dev deps**

Run from `blog-app-mui-frontend/`:

```bash
npm i better-sqlite3@^11
npm i -D vitest@^2 @types/better-sqlite3
```

Expected: deps added, no peer errors (ignore the `strict-peer-dependencies` npm warn — known in this repo).

- [ ] **Step 2: Create Vitest config scoped to server logic**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/server/llm-stats/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: { src: new URL("./src", import.meta.url).pathname },
  },
});
```

- [ ] **Step 3: Add test script**

In `package.json` `scripts`, add:

```json
"test:unit": "vitest run",
"test:unit:watch": "vitest"
```

- [ ] **Step 4: Verify Vitest runs (no tests yet → "no test files")**

Run: `npm run test:unit`
Expected: exits cleanly reporting no test files found (or 0 tests). Not an error.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore(llm-stats): add better-sqlite3 + scoped vitest"
```

**Improvement/automation idea:** Add `test:unit` to the lint-staged / CI gate so server-logic regressions are caught on push.

---

## Task 1: Types

**Files:**

- Create: `src/server/llm-stats/types.ts`

- [ ] **Step 1: Write the types file**

Create `src/server/llm-stats/types.ts`:

```ts
export type HarnessId =
  | "claude-code"
  | "codex"
  | "opencode"
  | "cursor"
  | "gemini"
  | "continue"
  | "goose"
  | "copilot";

export interface UsageEvent {
  harness: HarnessId;
  provider: string;
  model: string;
  modelFamily: string;
  ts: string; // ISO-8601
  dateKey: string; // YYYY-MM-DD local
  weekday: number; // 0=Sun..6=Sat
  hour: number; // 0-23 local
  project: string | null;
  tokensIn: number;
  tokensOut: number;
  cacheRead: number;
  cacheWrite: number;
  reasoning: number;
  costUsd: number | null;
  sessionId: string | null;
  gitBranch: string | null;
  skill: string | null;
  mcpTool: string | null;
  agent: string | null;
}

export interface SourceAdapter {
  harness: HarnessId;
  isAvailable: () => boolean;
  scan: () => UsageEvent[];
}

export interface PriceRow {
  in: number; // USD per 1M input tokens
  out: number;
  cacheRead: number;
  cacheWrite: number;
}
export type PriceTable = Record<string, PriceRow>;

export interface ModelStat {
  model: string;
  provider: string;
  modelFamily: string;
  requests: number;
  tokensIn: number;
  tokensOut: number;
  cacheRead: number;
  cacheWrite: number;
  costUsd: number | null;
}

export interface StatsBundle {
  kpis: {
    totalTokens: number;
    totalCostUsd: number;
    sessions: number;
    activeDays: number;
    topModelFamily: string | null;
    topHarness: HarnessId | null;
  };
  byModelFamily: {
    family: string;
    tokens: number;
    requests: number;
    costUsd: number;
  }[];
  byModel: ModelStat[];
  byHarness: {
    harness: HarnessId;
    tokens: number;
    requests: number;
    costUsd: number;
  }[];
  byProject: { project: string; tokens: number; requests: number }[];
  trend: {
    dateKey: string;
    tokens: number;
    costUsd: number;
    byHarness: Record<string, number>;
  }[];
  heatmap: { weekday: number; hour: number; tokens: number }[];
  claudeExtras: {
    topSkills: { name: string; count: number }[];
    topMcpTools: { name: string; count: number }[];
    cacheHitRatio: number;
    agentEvents: number;
  } | null;
  meta: {
    generatedAt: string;
    scannedFiles: number;
    harnessesAvailable: HarnessId[];
    warnings: string[];
  };
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no errors introduced by this file).

- [ ] **Step 3: Commit**

```bash
git add src/server/llm-stats/types.ts
git commit -m "feat(llm-stats): unified UsageEvent + StatsBundle types"
```

**Improvement/automation idea:** Generate a JSON Schema from these types so a future export/CSV feature and any external consumer share one contract.

---

## Task 2: Normalize helpers

**Files:**

- Create: `src/server/llm-stats/normalize.ts`
- Test: `src/server/llm-stats/__tests__/normalize.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/server/llm-stats/__tests__/normalize.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  modelFamily,
  providerOf,
  projectOf,
  dateParts,
} from "src/server/llm-stats/normalize";

describe("modelFamily", () => {
  it("collapses claude ids to family", () => {
    expect(modelFamily("claude-opus-4-8")).toBe("opus");
    expect(modelFamily("anthropic/claude-4.8-opus-20260528")).toBe("opus");
    expect(modelFamily("claude-sonnet-4-6")).toBe("sonnet");
    expect(modelFamily("claude-haiku-4-5-20251001")).toBe("haiku");
  });
  it("maps openai + others", () => {
    expect(modelFamily("gpt-4o")).toBe("gpt-4o");
    expect(modelFamily("o3")).toBe("o3");
    expect(modelFamily("glm-4-7")).toBe("glm");
    expect(modelFamily("<synthetic>")).toBe("synthetic");
  });
  it("falls back to the raw id lowercased for unknown", () => {
    expect(modelFamily("some-new-model")).toBe("some-new-model");
  });
});

describe("providerOf", () => {
  it("infers provider from id", () => {
    expect(providerOf("claude-opus-4-8")).toBe("anthropic");
    expect(providerOf("anthropic/claude-4.8-opus-20260528")).toBe("anthropic");
    expect(providerOf("gpt-4o")).toBe("openai");
    expect(providerOf("glm-4-7")).toBe("zhipu");
  });
});

describe("projectOf", () => {
  it("returns basename of cwd", () => {
    expect(projectOf("/Users/x/projects/blog-app-mui-frontend")).toBe(
      "blog-app-mui-frontend",
    );
    expect(projectOf(null)).toBe(null);
    expect(projectOf("")).toBe(null);
  });
});

describe("dateParts", () => {
  it("splits an ISO ts into local date/weekday/hour", () => {
    const p = dateParts("2026-06-21T15:13:37.550Z");
    expect(p.dateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(p.weekday).toBeGreaterThanOrEqual(0);
    expect(p.weekday).toBeLessThanOrEqual(6);
    expect(p.hour).toBeGreaterThanOrEqual(0);
    expect(p.hour).toBeLessThanOrEqual(23);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- normalize`
Expected: FAIL — `Cannot find module .../normalize`.

- [ ] **Step 3: Write minimal implementation**

Create `src/server/llm-stats/normalize.ts`:

```ts
export function modelFamily(model: string): string {
  const m = model.toLowerCase();
  if (m.includes("opus")) return "opus";
  if (m.includes("sonnet")) return "sonnet";
  if (m.includes("haiku")) return "haiku";
  if (m.includes("synthetic")) return "synthetic";
  if (m.includes("gpt-4o")) return "gpt-4o";
  if (m.startsWith("o3") || m.includes("/o3")) return "o3";
  if (m.startsWith("o1") || m.includes("/o1")) return "o1";
  if (m.includes("codex")) return "codex";
  if (m.includes("glm")) return "glm";
  if (m.includes("deepseek")) return "deepseek";
  if (m.includes("gemini")) return "gemini";
  return m;
}

export function providerOf(model: string): string {
  const m = model.toLowerCase();
  if (m.includes("claude") || m.includes("anthropic")) return "anthropic";
  if (
    m.includes("gpt") ||
    m.startsWith("o1") ||
    m.startsWith("o3") ||
    m.includes("codex")
  )
    return "openai";
  if (m.includes("glm")) return "zhipu";
  if (m.includes("deepseek")) return "deepseek";
  if (m.includes("gemini")) return "google";
  return "unknown";
}

export function projectOf(cwd: string | null): string | null {
  if (!cwd) return null;
  const parts = cwd.split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : null;
}

export function dateParts(iso: string): {
  dateKey: string;
  weekday: number;
  hour: number;
} {
  const d = new Date(iso);
  const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { dateKey, weekday: d.getDay(), hour: d.getHours() };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- normalize`
Expected: PASS, all assertions green.

- [ ] **Step 5: Commit**

```bash
git add src/server/llm-stats/normalize.ts src/server/llm-stats/__tests__/normalize.test.ts
git commit -m "feat(llm-stats): model/provider/project/date normalize helpers"
```

**Improvement/automation idea:** Drive `modelFamily` from a small data file instead of an if-chain, so adding a model is a one-line config change — and surface unknown models in `meta.warnings` to know when the table needs updating.

---

## Task 3: Pricing

**Files:**

- Create: `src/server/llm-stats/pricing.ts`
- Test: `src/server/llm-stats/__tests__/pricing.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/server/llm-stats/__tests__/pricing.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { costFor } from "src/server/llm-stats/pricing";
import type { UsageEvent } from "src/server/llm-stats/types";

function evt(partial: Partial<UsageEvent>): UsageEvent {
  return {
    harness: "claude-code",
    provider: "anthropic",
    model: "claude-opus-4-8",
    modelFamily: "opus",
    ts: "2026-06-21T00:00:00.000Z",
    dateKey: "2026-06-21",
    weekday: 0,
    hour: 0,
    project: null,
    tokensIn: 0,
    tokensOut: 0,
    cacheRead: 0,
    cacheWrite: 0,
    reasoning: 0,
    costUsd: null,
    sessionId: null,
    gitBranch: null,
    skill: null,
    mcpTool: null,
    agent: null,
    ...partial,
  };
}

describe("costFor", () => {
  it("computes cost from the price table for a known family", () => {
    // opus priced 15 in / 75 out per 1M (assumed in PRICE_TABLE)
    const c = costFor(
      evt({ modelFamily: "opus", tokensIn: 1_000_000, tokensOut: 1_000_000 }),
    );
    expect(c).not.toBeNull();
    expect(c).toBeCloseTo(15 + 75, 5);
  });
  it("returns null for an unpriced model", () => {
    expect(
      costFor(
        evt({ modelFamily: "totally-unknown", model: "totally-unknown" }),
      ),
    ).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- pricing`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `src/server/llm-stats/pricing.ts`. (Prices are best-effort public list prices, USD per 1M tokens, editable. Keyed by `modelFamily`.)

```ts
import type { UsageEvent, PriceTable } from "src/server/llm-stats/types";

export const PRICE_TABLE: PriceTable = {
  opus: { in: 15, out: 75, cacheRead: 1.5, cacheWrite: 18.75 },
  sonnet: { in: 3, out: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  haiku: { in: 0.8, out: 4, cacheRead: 0.08, cacheWrite: 1 },
  "gpt-4o": { in: 2.5, out: 10, cacheRead: 1.25, cacheWrite: 0 },
  o3: { in: 2, out: 8, cacheRead: 0.5, cacheWrite: 0 },
  o1: { in: 15, out: 60, cacheRead: 7.5, cacheWrite: 0 },
  codex: { in: 1.5, out: 6, cacheRead: 0.375, cacheWrite: 0 },
  glm: { in: 0.6, out: 2.2, cacheRead: 0.11, cacheWrite: 0 },
  deepseek: { in: 0.27, out: 1.1, cacheRead: 0.07, cacheWrite: 0 },
  gemini: { in: 1.25, out: 5, cacheRead: 0.31, cacheWrite: 0 },
};

export function costFor(e: UsageEvent): number | null {
  const row = PRICE_TABLE[e.modelFamily];
  if (!row) return null;
  return (
    (e.tokensIn * row.in +
      e.tokensOut * row.out +
      e.cacheRead * row.cacheRead +
      e.cacheWrite * row.cacheWrite) /
    1_000_000
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- pricing`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/server/llm-stats/pricing.ts src/server/llm-stats/__tests__/pricing.test.ts
git commit -m "feat(llm-stats): pricing table + costFor estimator"
```

**Improvement/automation idea:** Move `PRICE_TABLE` to a JSON file with a `lastVerified` date and a tiny script that warns when prices are >90 days stale; later, fetch list prices from a maintained source.

---

## Task 4: Claude Code adapter

**Files:**

- Create: `src/server/llm-stats/adapters/claude-code.ts`
- Test: `src/server/llm-stats/__tests__/claude-code.test.ts`
- Fixtures: `src/server/llm-stats/__tests__/fixtures/claude-code/<project>/<session>.jsonl`

- [ ] **Step 1: Create the fixture**

Create `src/server/llm-stats/__tests__/fixtures/claude-code/-Users-x-projects-demo/sess1.jsonl` with these exact lines (the third repeats the second `message.id` → must be deduped):

```jsonl
{"type":"user","timestamp":"2026-06-21T10:00:00.000Z","cwd":"/Users/x/projects/demo","sessionId":"sess1","message":{"role":"user","content":"hi"}}
{"type":"assistant","timestamp":"2026-06-21T10:00:05.000Z","cwd":"/Users/x/projects/demo","sessionId":"sess1","gitBranch":"main","message":{"id":"msg_A","model":"claude-opus-4-8","usage":{"input_tokens":100,"output_tokens":20,"cache_creation_input_tokens":40,"cache_read_input_tokens":200}}}
{"type":"assistant","timestamp":"2026-06-21T10:00:05.000Z","cwd":"/Users/x/projects/demo","sessionId":"sess1","gitBranch":"main","message":{"id":"msg_A","model":"claude-opus-4-8","usage":{"input_tokens":100,"output_tokens":20,"cache_creation_input_tokens":40,"cache_read_input_tokens":200}}}
{"type":"assistant","timestamp":"2026-06-21T14:30:00.000Z","cwd":"/Users/x/projects/demo","sessionId":"sess1","attributionSkill":"superpowers:brainstorming","attributionMcpTool":"figma__get_metadata","message":{"id":"msg_B","model":"claude-haiku-4-5-20251001","usage":{"input_tokens":50,"output_tokens":10,"cache_creation_input_tokens":0,"cache_read_input_tokens":0}}}
```

- [ ] **Step 2: Write the failing test**

Create `src/server/llm-stats/__tests__/claude-code.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { scanClaudeCode } from "src/server/llm-stats/adapters/claude-code";

const root = path.join(__dirname, "fixtures", "claude-code");

describe("scanClaudeCode", () => {
  const events = scanClaudeCode(root);

  it("emits one event per unique assistant message (dedup by message.id)", () => {
    expect(events).toHaveLength(2); // msg_A once + msg_B, user line ignored
  });
  it("maps usage fields and metadata", () => {
    const a = events.find((e) => e.model === "claude-opus-4-8")!;
    expect(a.harness).toBe("claude-code");
    expect(a.provider).toBe("anthropic");
    expect(a.modelFamily).toBe("opus");
    expect(a.tokensIn).toBe(100);
    expect(a.tokensOut).toBe(20);
    expect(a.cacheWrite).toBe(40); // cache_creation -> cacheWrite
    expect(a.cacheRead).toBe(200); // cache_read -> cacheRead
    expect(a.project).toBe("demo");
    expect(a.gitBranch).toBe("main");
  });
  it("captures skill + mcpTool attribution", () => {
    const b = events.find((e) => e.model.includes("haiku"))!;
    expect(b.skill).toBe("superpowers:brainstorming");
    expect(b.mcpTool).toBe("figma__get_metadata");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test:unit -- claude-code`
Expected: FAIL — module not found.

- [ ] **Step 4: Write the implementation**

Create `src/server/llm-stats/adapters/claude-code.ts`:

```ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { UsageEvent } from "src/server/llm-stats/types";
import {
  modelFamily,
  providerOf,
  projectOf,
  dateParts,
} from "src/server/llm-stats/normalize";
import { costFor } from "src/server/llm-stats/pricing";

export const CLAUDE_ROOT = path.join(os.homedir(), ".claude", "projects");

interface CcLine {
  type?: string;
  timestamp?: string;
  cwd?: string;
  sessionId?: string;
  gitBranch?: string;
  attributionSkill?: string;
  attributionMcpTool?: string;
  attributionAgent?: string;
  message?: {
    id?: string;
    model?: string;
    usage?: {
      input_tokens?: number;
      output_tokens?: number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
    };
  };
}

function* jsonlFiles(root: string): Generator<string> {
  if (!fs.existsSync(root)) return;
  for (const dir of fs.readdirSync(root)) {
    const full = path.join(root, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    for (const f of fs.readdirSync(full)) {
      if (f.endsWith(".jsonl")) yield path.join(full, f);
    }
  }
}

export function scanClaudeCode(root: string = CLAUDE_ROOT): UsageEvent[] {
  const events: UsageEvent[] = [];
  const seen = new Set<string>();
  for (const file of jsonlFiles(root)) {
    const text = fs.readFileSync(file, "utf8");
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      let o: CcLine;
      try {
        o = JSON.parse(line) as CcLine;
      } catch {
        continue;
      }
      if (o.type !== "assistant" || !o.message?.usage || !o.message.model)
        continue;
      const id = o.message.id;
      if (id) {
        if (seen.has(id)) continue;
        seen.add(id);
      }
      const model = o.message.model;
      const u = o.message.usage;
      const ts = o.timestamp ?? new Date(0).toISOString();
      const dp = dateParts(ts);
      const tokensIn = u.input_tokens ?? 0;
      const tokensOut = u.output_tokens ?? 0;
      const cacheWrite = u.cache_creation_input_tokens ?? 0;
      const cacheRead = u.cache_read_input_tokens ?? 0;
      const base: UsageEvent = {
        harness: "claude-code",
        provider: providerOf(model),
        model,
        modelFamily: modelFamily(model),
        ts,
        dateKey: dp.dateKey,
        weekday: dp.weekday,
        hour: dp.hour,
        project: projectOf(o.cwd ?? null),
        tokensIn,
        tokensOut,
        cacheRead,
        cacheWrite,
        reasoning: 0,
        costUsd: null,
        sessionId: o.sessionId ?? null,
        gitBranch: o.gitBranch ?? null,
        skill: o.attributionSkill ?? null,
        mcpTool: o.attributionMcpTool ?? null,
        agent: o.attributionAgent ?? null,
      };
      events.push({ ...base, costUsd: costFor(base) });
    }
  }
  return events;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:unit -- claude-code`
Expected: PASS (2 events, dedup works, fields mapped).

- [ ] **Step 6: Commit**

```bash
git add src/server/llm-stats/adapters/claude-code.ts "src/server/llm-stats/__tests__/claude-code.test.ts" "src/server/llm-stats/__tests__/fixtures/claude-code"
git commit -m "feat(llm-stats): Claude Code adapter (dedup by message.id)"
```

**Improvement/automation idea:** Stream files via `readline` + the incremental cache (Task 8) instead of `readFileSync` so a 639-file rescan only reads changed bytes.

---

## Task 5: Codex adapter

**Files:**

- Create: `src/server/llm-stats/adapters/codex.ts`
- Test: `src/server/llm-stats/__tests__/codex.test.ts`
- Fixtures: `src/server/llm-stats/__tests__/fixtures/codex/2026/06/21/rollout-demo.jsonl`

- [ ] **Step 1: Create the fixture**

Create `src/server/llm-stats/__tests__/fixtures/codex/2026/06/21/rollout-demo.jsonl`. Note: model is on `turn_context`; `token_count` totals are **cumulative** — the adapter must diff. Two turns: turn1 cumulative=100/0/20, turn2 cumulative=300/40/60 (delta 200/40/40).

```jsonl
{"timestamp":"2026-06-21T09:00:00.000Z","type":"session_meta","payload":{"id":"cdx1","cwd":"/Users/x/projects/api","model_provider":"openai"}}
{"timestamp":"2026-06-21T09:00:01.000Z","type":"turn_context","payload":{"model":"gpt-4o","cwd":"/Users/x/projects/api"}}
{"timestamp":"2026-06-21T09:00:05.000Z","type":"event_msg","payload":{"type":"token_count","info":{"total_token_usage":{"input_tokens":100,"cached_input_tokens":0,"output_tokens":20,"reasoning_output_tokens":5,"total_tokens":120}}}}
{"timestamp":"2026-06-21T09:05:00.000Z","type":"turn_context","payload":{"model":"gpt-4o","cwd":"/Users/x/projects/api"}}
{"timestamp":"2026-06-21T09:05:05.000Z","type":"event_msg","payload":{"type":"token_count","info":{"total_token_usage":{"input_tokens":300,"cached_input_tokens":40,"output_tokens":60,"reasoning_output_tokens":15,"total_tokens":400}}}}
```

- [ ] **Step 2: Write the failing test**

Create `src/server/llm-stats/__tests__/codex.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { scanCodex } from "src/server/llm-stats/adapters/codex";

const root = path.join(__dirname, "fixtures", "codex");

describe("scanCodex", () => {
  const events = scanCodex(root);

  it("emits one event per token_count with cumulative totals diffed", () => {
    expect(events).toHaveLength(2);
    const [t1, t2] = events;
    expect(t1.tokensIn).toBe(100);
    expect(t1.tokensOut).toBe(20);
    expect(t2.tokensIn).toBe(200); // 300-100
    expect(t2.tokensOut).toBe(40); // 60-20
    expect(t2.cacheRead).toBe(40); // 40-0 cached_input_tokens delta
  });
  it("joins model from the preceding turn_context", () => {
    expect(events[0].model).toBe("gpt-4o");
    expect(events[0].harness).toBe("codex");
    expect(events[0].provider).toBe("openai");
    expect(events[0].project).toBe("api");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test:unit -- codex`
Expected: FAIL — module not found.

- [ ] **Step 4: Write the implementation**

Create `src/server/llm-stats/adapters/codex.ts`:

```ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { UsageEvent } from "src/server/llm-stats/types";
import {
  modelFamily,
  providerOf,
  projectOf,
  dateParts,
} from "src/server/llm-stats/normalize";
import { costFor } from "src/server/llm-stats/pricing";

export const CODEX_ROOT = path.join(os.homedir(), ".codex", "sessions");

interface CodexLine {
  timestamp?: string;
  type?: string;
  payload?: {
    type?: string;
    model?: string;
    cwd?: string;
    info?: {
      total_token_usage?: {
        input_tokens?: number;
        cached_input_tokens?: number;
        output_tokens?: number;
        reasoning_output_tokens?: number;
      };
    };
  };
}

function* rolloutFiles(root: string): Generator<string> {
  if (!fs.existsSync(root)) return;
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop()!;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) stack.push(full);
      else if (name.endsWith(".jsonl")) yield full;
    }
  }
}

export function scanCodex(root: string = CODEX_ROOT): UsageEvent[] {
  const events: UsageEvent[] = [];
  for (const file of rolloutFiles(root)) {
    const text = fs.readFileSync(file, "utf8");
    let currentModel = "unknown";
    let currentCwd: string | null = null;
    let prev = { input: 0, cached: 0, output: 0, reasoning: 0 };
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      let o: CodexLine;
      try {
        o = JSON.parse(line) as CodexLine;
      } catch {
        continue;
      }
      if (o.type === "session_meta" && o.payload?.cwd)
        currentCwd = o.payload.cwd;
      if (o.type === "turn_context") {
        if (o.payload?.model) currentModel = o.payload.model;
        if (o.payload?.cwd) currentCwd = o.payload.cwd;
      }
      if (o.type === "event_msg" && o.payload?.type === "token_count") {
        const t = o.payload.info?.total_token_usage;
        if (!t) continue;
        const cum = {
          input: t.input_tokens ?? 0,
          cached: t.cached_input_tokens ?? 0,
          output: t.output_tokens ?? 0,
          reasoning: t.reasoning_output_tokens ?? 0,
        };
        const delta = {
          input: Math.max(0, cum.input - prev.input),
          cached: Math.max(0, cum.cached - prev.cached),
          output: Math.max(0, cum.output - prev.output),
          reasoning: Math.max(0, cum.reasoning - prev.reasoning),
        };
        prev = cum;
        if (delta.input === 0 && delta.output === 0 && delta.cached === 0)
          continue;
        const ts = o.timestamp ?? new Date(0).toISOString();
        const dp = dateParts(ts);
        const base: UsageEvent = {
          harness: "codex",
          provider: providerOf(currentModel),
          model: currentModel,
          modelFamily: modelFamily(currentModel),
          ts,
          dateKey: dp.dateKey,
          weekday: dp.weekday,
          hour: dp.hour,
          project: projectOf(currentCwd),
          tokensIn: delta.input,
          tokensOut: delta.output,
          cacheRead: delta.cached,
          cacheWrite: 0,
          reasoning: delta.reasoning,
          costUsd: null,
          sessionId: null,
          gitBranch: null,
          skill: null,
          mcpTool: null,
          agent: null,
        };
        events.push({ ...base, costUsd: costFor(base) });
      }
    }
  }
  return events;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:unit -- codex`
Expected: PASS (cumulative diffed, model joined).

- [ ] **Step 6: Commit**

```bash
git add src/server/llm-stats/adapters/codex.ts "src/server/llm-stats/__tests__/codex.test.ts" "src/server/llm-stats/__tests__/fixtures/codex"
git commit -m "feat(llm-stats): Codex adapter (cumulative diff + turn_context join)"
```

**Improvement/automation idea:** Detect Codex subagent rollouts (replayed parent history) and skip them to avoid the up-to-91× overcount ccusage reported — key off `session_meta.payload.originator` or a parent-id field.

---

## Task 6: OpenCode adapter

**Files:**

- Create: `src/server/llm-stats/adapters/opencode.ts`
- Test: `src/server/llm-stats/__tests__/opencode.test.ts`
- Fixture: built in-test via `better-sqlite3` (no binary fixture committed)

- [ ] **Step 1: Write the failing test (builds a temp sqlite db)**

Create `src/server/llm-stats/__tests__/opencode.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { scanOpenCode } from "src/server/llm-stats/adapters/opencode";

let dbPath: string;

beforeAll(() => {
  dbPath = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), "oc-")),
    "opencode.db",
  );
  const db = new Database(dbPath);
  db.exec("CREATE TABLE message (id TEXT, data TEXT)");
  const row = {
    role: "assistant",
    modelID: "gpt-4o",
    providerID: "openai",
    time: { created: 1782000000000, completed: 1782000001000 },
    tokens: {
      input: 80,
      output: 14,
      reasoning: 0,
      cache: { read: 5, write: 3 },
    },
    path: {
      cwd: "/Users/x/projects/oc-demo",
      root: "/Users/x/projects/oc-demo",
    },
  };
  db.prepare("INSERT INTO message (id, data) VALUES (?, ?)").run(
    "m1",
    JSON.stringify(row),
  );
  db.prepare("INSERT INTO message (id, data) VALUES (?, ?)").run(
    "u1",
    JSON.stringify({ role: "user" }),
  );
  db.close();
});

afterAll(() =>
  fs.rmSync(path.dirname(dbPath), { recursive: true, force: true }),
);

describe("scanOpenCode", () => {
  it("reads assistant messages from the sqlite db", () => {
    const events = scanOpenCode(dbPath);
    expect(events).toHaveLength(1);
    const e = events[0];
    expect(e.harness).toBe("opencode");
    expect(e.model).toBe("gpt-4o");
    expect(e.tokensIn).toBe(80);
    expect(e.cacheRead).toBe(5);
    expect(e.cacheWrite).toBe(3);
    expect(e.project).toBe("oc-demo");
  });
  it("returns [] when the db path does not exist", () => {
    expect(scanOpenCode("/no/such/opencode.db")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- opencode`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `src/server/llm-stats/adapters/opencode.ts`:

```ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import type { UsageEvent } from "src/server/llm-stats/types";
import {
  modelFamily,
  providerOf,
  projectOf,
  dateParts,
} from "src/server/llm-stats/normalize";
import { costFor } from "src/server/llm-stats/pricing";

export const OPENCODE_DB = path.join(
  os.homedir(),
  ".local",
  "share",
  "opencode",
  "opencode.db",
);

interface OcMessage {
  role?: string;
  modelID?: string;
  providerID?: string;
  model?: { providerID?: string; modelID?: string };
  time?: { created?: number };
  tokens?: {
    input?: number;
    output?: number;
    reasoning?: number;
    cache?: { read?: number; write?: number };
  };
  path?: { cwd?: string };
}

export function scanOpenCode(dbPath: string = OPENCODE_DB): UsageEvent[] {
  if (!fs.existsSync(dbPath)) return [];
  const events: UsageEvent[] = [];
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare("SELECT data FROM message").all() as {
      data: string;
    }[];
    for (const { data } of rows) {
      let m: OcMessage;
      try {
        m = JSON.parse(data) as OcMessage;
      } catch {
        continue;
      }
      if (m.role !== "assistant") continue;
      const model = m.modelID ?? m.model?.modelID ?? "unknown";
      const created = m.time?.created ?? 0;
      const ts = new Date(created).toISOString();
      const dp = dateParts(ts);
      const tok = m.tokens ?? {};
      const base: UsageEvent = {
        harness: "opencode",
        provider: providerOf(model),
        model,
        modelFamily: modelFamily(model),
        ts,
        dateKey: dp.dateKey,
        weekday: dp.weekday,
        hour: dp.hour,
        project: projectOf(m.path?.cwd ?? null),
        tokensIn: tok.input ?? 0,
        tokensOut: tok.output ?? 0,
        cacheRead: tok.cache?.read ?? 0,
        cacheWrite: tok.cache?.write ?? 0,
        reasoning: tok.reasoning ?? 0,
        costUsd: null,
        sessionId: null,
        gitBranch: null,
        skill: null,
        mcpTool: null,
        agent: null,
      };
      events.push({ ...base, costUsd: costFor(base) });
    }
  } finally {
    db.close();
  }
  return events;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- opencode`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/server/llm-stats/adapters/opencode.ts "src/server/llm-stats/__tests__/opencode.test.ts"
git commit -m "feat(llm-stats): OpenCode adapter (sqlite message.data)"
```

**Improvement/automation idea:** Support the pre-1.2.0 OpenCode JSON-file layout (`storage/message/*.json`) by detecting which exists at runtime, so older installs still report.

---

## Task 7: Aggregate

**Files:**

- Create: `src/server/llm-stats/aggregate.ts`
- Test: `src/server/llm-stats/__tests__/aggregate.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/server/llm-stats/__tests__/aggregate.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { aggregate } from "src/server/llm-stats/aggregate";
import type { UsageEvent } from "src/server/llm-stats/types";

function evt(p: Partial<UsageEvent>): UsageEvent {
  return {
    harness: "claude-code",
    provider: "anthropic",
    model: "claude-opus-4-8",
    modelFamily: "opus",
    ts: "2026-06-21T10:00:00.000Z",
    dateKey: "2026-06-21",
    weekday: 0,
    hour: 10,
    project: "demo",
    tokensIn: 0,
    tokensOut: 0,
    cacheRead: 0,
    cacheWrite: 0,
    reasoning: 0,
    costUsd: 0,
    sessionId: "s1",
    gitBranch: null,
    skill: null,
    mcpTool: null,
    agent: null,
    ...p,
  };
}

describe("aggregate", () => {
  const events: UsageEvent[] = [
    evt({
      tokensIn: 100,
      tokensOut: 20,
      costUsd: 0.5,
      sessionId: "s1",
      skill: "brainstorm",
      mcpTool: "figma",
    }),
    evt({
      model: "claude-haiku-4-5",
      modelFamily: "haiku",
      tokensIn: 50,
      tokensOut: 10,
      costUsd: 0.1,
      sessionId: "s2",
      dateKey: "2026-06-22",
      cacheRead: 200,
    }),
    evt({
      harness: "codex",
      provider: "openai",
      model: "gpt-4o",
      modelFamily: "gpt-4o",
      tokensIn: 30,
      tokensOut: 5,
      costUsd: 0.2,
      sessionId: "s3",
    }),
  ];
  const b = aggregate(events, ["claude-code", "codex"], 3, []);

  it("computes KPIs", () => {
    expect(b.kpis.totalTokens).toBe(100 + 20 + 50 + 10 + 200 + 30 + 5);
    expect(b.kpis.totalCostUsd).toBeCloseTo(0.8, 5);
    expect(b.kpis.sessions).toBe(3);
    expect(b.kpis.activeDays).toBe(2);
    expect(b.kpis.topHarness).toBe("claude-code");
  });
  it("buckets by harness, family, project, trend, heatmap", () => {
    expect(b.byHarness.find((h) => h.harness === "codex")!.requests).toBe(1);
    expect(b.byModelFamily.some((f) => f.family === "haiku")).toBe(true);
    expect(b.byProject[0].project).toBe("demo");
    expect(b.trend).toHaveLength(2);
    expect(b.heatmap.find((c) => c.hour === 10)!.tokens).toBeGreaterThan(0);
  });
  it("builds claude extras when CC present", () => {
    expect(b.claudeExtras).not.toBeNull();
    expect(b.claudeExtras!.topSkills[0].name).toBe("brainstorm");
    expect(b.claudeExtras!.topMcpTools[0].name).toBe("figma");
    expect(b.claudeExtras!.cacheHitRatio).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- aggregate`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `src/server/llm-stats/aggregate.ts`:

```ts
import type {
  HarnessId,
  StatsBundle,
  UsageEvent,
  ModelStat,
} from "src/server/llm-stats/types";

function tokensOf(e: UsageEvent): number {
  return e.tokensIn + e.tokensOut + e.cacheRead + e.cacheWrite;
}

function topCounts(
  pairs: (string | null)[],
): { name: string; count: number }[] {
  const m = new Map<string, number>();
  for (const p of pairs) {
    if (!p) continue;
    m.set(p, (m.get(p) ?? 0) + 1);
  }
  return [...m.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function aggregate(
  events: UsageEvent[],
  harnessesAvailable: HarnessId[],
  scannedFiles: number,
  warnings: string[],
): StatsBundle {
  const byHarness = new Map<
    HarnessId,
    { tokens: number; requests: number; costUsd: number }
  >();
  const byFamily = new Map<
    string,
    { tokens: number; requests: number; costUsd: number }
  >();
  const byModel = new Map<string, ModelStat>();
  const byProject = new Map<string, { tokens: number; requests: number }>();
  const trend = new Map<
    string,
    { tokens: number; costUsd: number; byHarness: Record<string, number> }
  >();
  const heat = new Map<string, number>();
  const sessions = new Set<string>();
  const days = new Set<string>();

  let totalTokens = 0;
  let totalCostUsd = 0;
  let ccCacheRead = 0;
  let ccCacheTotal = 0;
  let agentEvents = 0;

  for (const e of events) {
    const t = tokensOf(e);
    totalTokens += t;
    totalCostUsd += e.costUsd ?? 0;
    if (e.sessionId) sessions.add(`${e.harness}:${e.sessionId}`);
    days.add(e.dateKey);

    const h = byHarness.get(e.harness) ?? {
      tokens: 0,
      requests: 0,
      costUsd: 0,
    };
    h.tokens += t;
    h.requests += 1;
    h.costUsd += e.costUsd ?? 0;
    byHarness.set(e.harness, h);

    const f = byFamily.get(e.modelFamily) ?? {
      tokens: 0,
      requests: 0,
      costUsd: 0,
    };
    f.tokens += t;
    f.requests += 1;
    f.costUsd += e.costUsd ?? 0;
    byFamily.set(e.modelFamily, f);

    const ms = byModel.get(e.model) ?? {
      model: e.model,
      provider: e.provider,
      modelFamily: e.modelFamily,
      requests: 0,
      tokensIn: 0,
      tokensOut: 0,
      cacheRead: 0,
      cacheWrite: 0,
      costUsd: 0,
    };
    ms.requests += 1;
    ms.tokensIn += e.tokensIn;
    ms.tokensOut += e.tokensOut;
    ms.cacheRead += e.cacheRead;
    ms.cacheWrite += e.cacheWrite;
    ms.costUsd = (ms.costUsd ?? 0) + (e.costUsd ?? 0);
    byModel.set(e.model, ms);

    if (e.project) {
      const p = byProject.get(e.project) ?? { tokens: 0, requests: 0 };
      p.tokens += t;
      p.requests += 1;
      byProject.set(e.project, p);
    }

    const tr = trend.get(e.dateKey) ?? { tokens: 0, costUsd: 0, byHarness: {} };
    tr.tokens += t;
    tr.costUsd += e.costUsd ?? 0;
    tr.byHarness[e.harness] = (tr.byHarness[e.harness] ?? 0) + t;
    trend.set(e.dateKey, tr);

    const hk = `${e.weekday}:${e.hour}`;
    heat.set(hk, (heat.get(hk) ?? 0) + t);

    if (e.harness === "claude-code") {
      ccCacheRead += e.cacheRead;
      ccCacheTotal += e.cacheRead + e.tokensIn;
      if (e.agent) agentEvents += 1;
    }
  }

  const harnessArr = [...byHarness.entries()]
    .map(([harness, v]) => ({ harness, ...v }))
    .sort((a, b) => b.tokens - a.tokens);
  const familyArr = [...byFamily.entries()]
    .map(([family, v]) => ({ family, ...v }))
    .sort((a, b) => b.tokens - a.tokens);
  const projectArr = [...byProject.entries()]
    .map(([project, v]) => ({ project, ...v }))
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, 15);
  const trendArr = [...trend.entries()]
    .map(([dateKey, v]) => ({ dateKey, ...v }))
    .sort((a, b) => (a.dateKey < b.dateKey ? -1 : 1));
  const heatArr = [...heat.entries()].map(([k, tokens]) => {
    const [weekday, hour] = k.split(":").map(Number);
    return { weekday, hour, tokens };
  });

  const ccEvents = events.filter((e) => e.harness === "claude-code");
  const claudeExtras = ccEvents.length
    ? {
        topSkills: topCounts(ccEvents.map((e) => e.skill)),
        topMcpTools: topCounts(ccEvents.map((e) => e.mcpTool)),
        cacheHitRatio: ccCacheTotal > 0 ? ccCacheRead / ccCacheTotal : 0,
        agentEvents,
      }
    : null;

  return {
    kpis: {
      totalTokens,
      totalCostUsd,
      sessions: sessions.size,
      activeDays: days.size,
      topModelFamily: familyArr[0]?.family ?? null,
      topHarness: harnessArr[0]?.harness ?? null,
    },
    byModelFamily: familyArr,
    byModel: [...byModel.values()].sort(
      (a, b) => b.tokensIn + b.tokensOut - (a.tokensIn + a.tokensOut),
    ),
    byHarness: harnessArr,
    byProject: projectArr,
    trend: trendArr,
    heatmap: heatArr,
    claudeExtras,
    meta: {
      generatedAt: new Date().toISOString(),
      scannedFiles,
      harnessesAvailable,
      warnings,
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- aggregate`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/server/llm-stats/aggregate.ts "src/server/llm-stats/__tests__/aggregate.test.ts"
git commit -m "feat(llm-stats): aggregate events into StatsBundle"
```

**Improvement/automation idea:** Add a date-range param to `aggregate` (or a pre-filter) so the UI can show "last 7 / 30 / all days" without rescanning disk.

---

## Task 8: Scan orchestrator

**Files:**

- Create: `src/server/llm-stats/scan.ts`
- Test: `src/server/llm-stats/__tests__/scan.test.ts` (uses the fixture roots from Tasks 4–6)

- [ ] **Step 1: Write the failing test**

Create `src/server/llm-stats/__tests__/scan.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { runAdapters } from "src/server/llm-stats/scan";

const fx = path.join(__dirname, "fixtures");

describe("runAdapters", () => {
  it("merges events from all available adapters and reports availability", () => {
    const { events, harnessesAvailable, scannedFiles, warnings } = runAdapters({
      claudeRoot: path.join(fx, "claude-code"),
      codexRoot: path.join(fx, "codex"),
      opencodeDb: "/no/such/opencode.db",
    });
    expect(events.length).toBeGreaterThan(0);
    expect(harnessesAvailable).toContain("claude-code");
    expect(harnessesAvailable).toContain("codex");
    expect(harnessesAvailable).not.toContain("opencode"); // db missing
    expect(scannedFiles).toBeGreaterThan(0);
    expect(Array.isArray(warnings)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- scan`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `src/server/llm-stats/scan.ts`:

```ts
import fs from "node:fs";
import type { HarnessId, UsageEvent } from "src/server/llm-stats/types";
import {
  scanClaudeCode,
  CLAUDE_ROOT,
} from "src/server/llm-stats/adapters/claude-code";
import { scanCodex, CODEX_ROOT } from "src/server/llm-stats/adapters/codex";
import {
  scanOpenCode,
  OPENCODE_DB,
} from "src/server/llm-stats/adapters/opencode";

export interface ScanRoots {
  claudeRoot?: string;
  codexRoot?: string;
  opencodeDb?: string;
}

export interface ScanResult {
  events: UsageEvent[];
  harnessesAvailable: HarnessId[];
  scannedFiles: number;
  warnings: string[];
}

function countFiles(root: string, ext: string): number {
  if (!fs.existsSync(root)) return 0;
  let n = 0;
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop()!;
    for (const name of fs.readdirSync(dir)) {
      const full = `${dir}/${name}`;
      const st = fs.statSync(full);
      if (st.isDirectory()) stack.push(full);
      else if (name.endsWith(ext)) n += 1;
    }
  }
  return n;
}

export function runAdapters(roots: ScanRoots = {}): ScanResult {
  const claudeRoot = roots.claudeRoot ?? CLAUDE_ROOT;
  const codexRoot = roots.codexRoot ?? CODEX_ROOT;
  const opencodeDb = roots.opencodeDb ?? OPENCODE_DB;

  const events: UsageEvent[] = [];
  const harnessesAvailable: HarnessId[] = [];
  const warnings: string[] = [];
  let scannedFiles = 0;

  if (fs.existsSync(claudeRoot)) {
    try {
      const e = scanClaudeCode(claudeRoot);
      events.push(...e);
      harnessesAvailable.push("claude-code");
      scannedFiles += countFiles(claudeRoot, ".jsonl");
    } catch (err) {
      warnings.push(`claude-code: ${(err as Error).message}`);
    }
  }
  if (fs.existsSync(codexRoot)) {
    try {
      const e = scanCodex(codexRoot);
      events.push(...e);
      harnessesAvailable.push("codex");
      scannedFiles += countFiles(codexRoot, ".jsonl");
    } catch (err) {
      warnings.push(`codex: ${(err as Error).message}`);
    }
  }
  if (fs.existsSync(opencodeDb)) {
    try {
      const e = scanOpenCode(opencodeDb);
      events.push(...e);
      harnessesAvailable.push("opencode");
      scannedFiles += 1;
    } catch (err) {
      warnings.push(`opencode: ${(err as Error).message}`);
    }
  }

  return { events, harnessesAvailable, scannedFiles, warnings };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- scan`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/server/llm-stats/scan.ts "src/server/llm-stats/__tests__/scan.test.ts"
git commit -m "feat(llm-stats): scan orchestrator across available adapters"
```

**Improvement/automation idea:** Add the incremental mtime/offset cache here (`cache.ts`) so repeat scans skip unchanged files — biggest win on the 639-file Claude Code tree.

---

## Task 9: API route

**Files:**

- Create: `src/app/api/llm-stats/route.ts`

- [ ] **Step 1: Write the route**

Create `src/app/api/llm-stats/route.ts`:

```ts
import { NextResponse } from "next/server";
import { runAdapters } from "src/server/llm-stats/scan";
import { aggregate } from "src/server/llm-stats/aggregate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const { events, harnessesAvailable, scannedFiles, warnings } = runAdapters();
  if (!harnessesAvailable.length) {
    warnings.push(
      "No local harness data found on this host (expected on production).",
    );
  }
  const bundle = aggregate(events, harnessesAvailable, scannedFiles, warnings);
  return NextResponse.json(bundle);
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.

- [ ] **Step 3: Manual smoke (dev server)**

Per the worktree preview rules, start the dev server (symlink node_modules, copy `.env.local`, run next WITHOUT `--turbo`, port 3055) and hit the route:

```bash
curl -s http://localhost:3055/api/llm-stats | head -c 400
```

Expected: JSON with `kpis`, `byModelFamily`, `meta.harnessesAvailable` including `claude-code`.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/llm-stats/route.ts
git commit -m "feat(llm-stats): GET /api/llm-stats route (node runtime)"
```

**Improvement/automation idea:** Cache the bundle in-memory with a short TTL (e.g. 60s) so repeated dashboard loads don't rescan disk every request.

---

## Task 10: SWR hook + view types/const/utils

**Files:**

- Create: `src/actions/llm-stats.ts`
- Create: `src/sections/admin/llm-stats/types.ts`
- Create: `src/sections/admin/llm-stats/const.ts`
- Create: `src/sections/admin/llm-stats/utils.ts`

- [ ] **Step 1: Create the view types (mirror StatsBundle for the client)**

Create `src/sections/admin/llm-stats/types.ts`:

```ts
import type { StatsBundle } from "src/server/llm-stats/types";

export type LlmStats = StatsBundle;

export interface LlmStatsResponse extends LlmStats {}
```

- [ ] **Step 2: Create the SWR hook**

Create `src/actions/llm-stats.ts` (this route is same-origin, NOT the backend axios base — use a native-fetch fetcher):

```ts
import useSWR from "swr";
import { useMemo } from "react";
import type { LlmStatsResponse } from "src/sections/admin/llm-stats/types";

const jsonFetcher = (url: string): Promise<LlmStatsResponse> =>
  fetch(url).then((r) => r.json() as Promise<LlmStatsResponse>);

export function useGetLlmStats() {
  const { data, isLoading, error } = useSWR<LlmStatsResponse>(
    "/api/llm-stats",
    jsonFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return useMemo(
    () => ({ stats: data ?? null, statsLoading: isLoading, statsError: error }),
    [data, isLoading, error],
  );
}
```

- [ ] **Step 3: Create const (colors + labels)**

Create `src/sections/admin/llm-stats/const.ts`:

```ts
import type { HarnessId } from "src/server/llm-stats/types";

export const HARNESS_LABEL: Record<HarnessId, string> = {
  "claude-code": "Claude Code",
  codex: "Codex",
  opencode: "OpenCode",
  cursor: "Cursor",
  gemini: "Gemini CLI",
  continue: "Continue",
  goose: "Goose",
  copilot: "Copilot CLI",
};

export const FAMILY_LABEL: Record<string, string> = {
  opus: "Opus",
  sonnet: "Sonnet",
  haiku: "Haiku",
  "gpt-4o": "GPT-4o",
  o3: "o3",
  glm: "GLM",
  deepseek: "DeepSeek",
  gemini: "Gemini",
  synthetic: "Synthetic",
};
```

- [ ] **Step 4: Create utils (formatters)**

Create `src/sections/admin/llm-stats/utils.ts`:

```ts
export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

export function familyLabel(
  family: string,
  map: Record<string, string>,
): string {
  return map[family] ?? family;
}
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/actions/llm-stats.ts "src/sections/admin/llm-stats/types.ts" "src/sections/admin/llm-stats/const.ts" "src/sections/admin/llm-stats/utils.ts"
git commit -m "feat(llm-stats): SWR hook + view types/const/utils"
```

**Improvement/automation idea:** Add a `?days=7` query param plumbed from a UI toggle through the hook to the route.

---

## Task 11: Widgets — KPI row, honesty banner, model table

**Files:**

- Create: `src/sections/admin/llm-stats/widgets/kpi-row.tsx`
- Create: `src/sections/admin/llm-stats/widgets/honesty-banner.tsx`
- Create: `src/sections/admin/llm-stats/widgets/model-table.tsx`

- [ ] **Step 1: KPI row**

Create `src/sections/admin/llm-stats/widgets/kpi-row.tsx`:

```tsx
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { LlmStats } from "src/sections/admin/llm-stats/types";
import { formatTokens, formatUsd } from "src/sections/admin/llm-stats/utils";
import {
  HARNESS_LABEL,
  FAMILY_LABEL,
} from "src/sections/admin/llm-stats/const";

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={0.5}>
        <Typography variant="h3">{value}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
      </Stack>
    </Card>
  );
}

export function KpiRow({ stats }: { stats: LlmStats }) {
  const k = stats.kpis;
  const cells = [
    { label: "Всего токенов", value: formatTokens(k.totalTokens) },
    { label: "Оценка стоимости", value: formatUsd(k.totalCostUsd) },
    { label: "Сессий", value: String(k.sessions) },
    { label: "Активных дней", value: String(k.activeDays) },
    {
      label: "Топ модель",
      value: k.topModelFamily
        ? (FAMILY_LABEL[k.topModelFamily] ?? k.topModelFamily)
        : "—",
    },
    {
      label: "Топ инструмент",
      value: k.topHarness ? HARNESS_LABEL[k.topHarness] : "—",
    },
  ];
  return (
    <Grid container spacing={3}>
      {cells.map((c) => (
        <Grid key={c.label} size={{ xs: 6, md: 2 }}>
          <Kpi label={c.label} value={c.value} />
        </Grid>
      ))}
    </Grid>
  );
}
```

- [ ] **Step 2: Honesty banner**

Create `src/sections/admin/llm-stats/widgets/honesty-banner.tsx`:

```tsx
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import type { LlmStats } from "src/sections/admin/llm-stats/types";

export function HonestyBanner({ stats }: { stats: LlmStats }) {
  return (
    <Stack spacing={1}>
      <Alert severity="info">
        Стоимость — приблизительная оценка по публичным прайс-листам, не
        биллинг.
      </Alert>
      {stats.meta.warnings.map((w) => (
        <Alert key={w} severity="warning">
          {w}
        </Alert>
      ))}
    </Stack>
  );
}
```

- [ ] **Step 3: Model table**

Create `src/sections/admin/llm-stats/widgets/model-table.tsx`:

```tsx
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CardHeader from "@mui/material/CardHeader";
import type { LlmStats } from "src/sections/admin/llm-stats/types";
import { formatTokens, formatUsd } from "src/sections/admin/llm-stats/utils";

export function ModelTable({ stats }: { stats: LlmStats }) {
  return (
    <Card>
      <CardHeader title="Модели" />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Модель</TableCell>
            <TableCell align="right">Запросов</TableCell>
            <TableCell align="right">Вход</TableCell>
            <TableCell align="right">Выход</TableCell>
            <TableCell align="right">Кэш</TableCell>
            <TableCell align="right">Оценка $</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.byModel.map((m) => (
            <TableRow key={m.model}>
              <TableCell>{m.model}</TableCell>
              <TableCell align="right">{m.requests}</TableCell>
              <TableCell align="right">{formatTokens(m.tokensIn)}</TableCell>
              <TableCell align="right">{formatTokens(m.tokensOut)}</TableCell>
              <TableCell align="right">
                {formatTokens(m.cacheRead + m.cacheWrite)}
              </TableCell>
              <TableCell align="right">
                {m.costUsd == null ? "—" : formatUsd(m.costUsd)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/sections/admin/llm-stats/widgets/kpi-row.tsx" "src/sections/admin/llm-stats/widgets/honesty-banner.tsx" "src/sections/admin/llm-stats/widgets/model-table.tsx"
git commit -m "feat(llm-stats): KPI row, honesty banner, model table widgets"
```

**Improvement/automation idea:** Make the model table sortable + add a CSV export button using the same `byModel` data.

---

## Task 12: Widgets — charts (model/harness/trend/heatmap/projects/claude-extras)

**Files:**

- Create: `src/sections/admin/llm-stats/widgets/model-split-chart.tsx`
- Create: `src/sections/admin/llm-stats/widgets/harness-split-chart.tsx`
- Create: `src/sections/admin/llm-stats/widgets/trend-chart.tsx`
- Create: `src/sections/admin/llm-stats/widgets/activity-heatmap.tsx`
- Create: `src/sections/admin/llm-stats/widgets/top-projects-chart.tsx`
- Create: `src/sections/admin/llm-stats/widgets/claude-extras.tsx`

> Charts use `react-apexcharts` (already a dep). Import dynamically with `ssr:false` since ApexCharts touches `window`.

- [ ] **Step 1: Model split (donut)**

Create `src/sections/admin/llm-stats/widgets/model-split-chart.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import type { LlmStats } from "src/sections/admin/llm-stats/types";
import { FAMILY_LABEL } from "src/sections/admin/llm-stats/const";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function ModelSplitChart({ stats }: { stats: LlmStats }) {
  const labels = stats.byModelFamily.map(
    (f) => FAMILY_LABEL[f.family] ?? f.family,
  );
  const series = stats.byModelFamily.map((f) => f.tokens);
  return (
    <Card>
      <CardHeader title="Модели (доля токенов)" />
      <Box sx={{ p: 3 }}>
        <Chart
          type="donut"
          series={series}
          options={{ labels, legend: { position: "bottom" } }}
          height={320}
        />
      </Box>
    </Card>
  );
}
```

- [ ] **Step 2: Harness split (donut)**

Create `src/sections/admin/llm-stats/widgets/harness-split-chart.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import type { LlmStats } from "src/sections/admin/llm-stats/types";
import { HARNESS_LABEL } from "src/sections/admin/llm-stats/const";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function HarnessSplitChart({ stats }: { stats: LlmStats }) {
  const labels = stats.byHarness.map((h) => HARNESS_LABEL[h.harness]);
  const series = stats.byHarness.map((h) => h.tokens);
  return (
    <Card>
      <CardHeader title="Инструменты (доля токенов)" />
      <Box sx={{ p: 3 }}>
        <Chart
          type="donut"
          series={series}
          options={{ labels, legend: { position: "bottom" } }}
          height={320}
        />
      </Box>
    </Card>
  );
}
```

- [ ] **Step 3: Trend (area)**

Create `src/sections/admin/llm-stats/widgets/trend-chart.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import type { LlmStats } from "src/sections/admin/llm-stats/types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function TrendChart({ stats }: { stats: LlmStats }) {
  const categories = stats.trend.map((t) => t.dateKey);
  const series = [{ name: "Токены", data: stats.trend.map((t) => t.tokens) }];
  return (
    <Card>
      <CardHeader title="Токены по дням" />
      <Box sx={{ p: 3 }}>
        <Chart
          type="area"
          series={series}
          options={{
            xaxis: { categories },
            dataLabels: { enabled: false },
            stroke: { curve: "smooth" },
          }}
          height={320}
        />
      </Box>
    </Card>
  );
}
```

- [ ] **Step 4: Activity heatmap**

Create `src/sections/admin/llm-stats/widgets/activity-heatmap.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import type { LlmStats } from "src/sections/admin/llm-stats/types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export function ActivityHeatmap({ stats }: { stats: LlmStats }) {
  const byCell = new Map<string, number>();
  for (const c of stats.heatmap) byCell.set(`${c.weekday}:${c.hour}`, c.tokens);
  const series = DAYS.map((name, weekday) => ({
    name,
    data: Array.from({ length: 24 }, (_, hour) => ({
      x: String(hour),
      y: byCell.get(`${weekday}:${hour}`) ?? 0,
    })),
  }));
  return (
    <Card>
      <CardHeader title="Активность по часам" />
      <Box sx={{ p: 3 }}>
        <Chart
          type="heatmap"
          series={series}
          options={{
            dataLabels: { enabled: false },
            xaxis: { type: "category" },
          }}
          height={360}
        />
      </Box>
    </Card>
  );
}
```

- [ ] **Step 5: Top projects (bar)**

Create `src/sections/admin/llm-stats/widgets/top-projects-chart.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import type { LlmStats } from "src/sections/admin/llm-stats/types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function TopProjectsChart({ stats }: { stats: LlmStats }) {
  const rows = stats.byProject.slice(0, 10);
  const categories = rows.map((r) => r.project);
  const series = [{ name: "Токены", data: rows.map((r) => r.tokens) }];
  return (
    <Card>
      <CardHeader title="Топ проекты" />
      <Box sx={{ p: 3 }}>
        <Chart
          type="bar"
          series={series}
          options={{
            plotOptions: { bar: { horizontal: true } },
            xaxis: { categories },
          }}
          height={360}
        />
      </Box>
    </Card>
  );
}
```

- [ ] **Step 6: Claude extras**

Create `src/sections/admin/llm-stats/widgets/claude-extras.tsx`:

```tsx
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import type { LlmStats } from "src/sections/admin/llm-stats/types";

export function ClaudeExtras({ stats }: { stats: LlmStats }) {
  const x = stats.claudeExtras;
  if (!x) return null;
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 3 }}>
          <CardHeader title="Кэш-хит (Claude Code)" sx={{ p: 0, mb: 2 }} />
          <LinearProgress
            variant="determinate"
            value={Math.round(x.cacheHitRatio * 100)}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {Math.round(x.cacheHitRatio * 100)}% · агентов: {x.agentEvents}
          </Typography>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 3 }}>
          <CardHeader title="Топ скиллы" sx={{ p: 0, mb: 2 }} />
          <Stack spacing={0.5}>
            {x.topSkills.map((s) => (
              <Typography key={s.name} variant="body2">
                {s.name} — {s.count}
              </Typography>
            ))}
          </Stack>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 3 }}>
          <CardHeader title="Топ MCP-тулы" sx={{ p: 0, mb: 2 }} />
          <Stack spacing={0.5}>
            {x.topMcpTools.map((s) => (
              <Typography key={s.name} variant="body2">
                {s.name} — {s.count}
              </Typography>
            ))}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
```

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add "src/sections/admin/llm-stats/widgets"
git commit -m "feat(llm-stats): chart widgets (model/harness/trend/heatmap/projects/extras)"
```

**Improvement/automation idea:** Pull all chart colors from `theme.palette` (Minimals chart helpers) so they track light/dark + primary changes per the repo CSS guideline.

---

## Task 13: View + page + nav wiring

**Files:**

- Create: `src/sections/admin/llm-stats/llm-stats-view.tsx`
- Create: `src/app/dashboard/admin/llm-stats/page.tsx`
- Modify: `src/routes/paths.ts` (add `llmStats` to admin interface + values)
- Modify: `src/layouts/config-nav-dashboard.tsx` (add nav item)

- [ ] **Step 1: Compose the view**

Create `src/sections/admin/llm-stats/llm-stats-view.tsx`:

```tsx
"use client";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useGetLlmStats } from "src/actions/llm-stats";
import { KpiRow } from "src/sections/admin/llm-stats/widgets/kpi-row";
import { HonestyBanner } from "src/sections/admin/llm-stats/widgets/honesty-banner";
import { ModelSplitChart } from "src/sections/admin/llm-stats/widgets/model-split-chart";
import { HarnessSplitChart } from "src/sections/admin/llm-stats/widgets/harness-split-chart";
import { TrendChart } from "src/sections/admin/llm-stats/widgets/trend-chart";
import { ActivityHeatmap } from "src/sections/admin/llm-stats/widgets/activity-heatmap";
import { TopProjectsChart } from "src/sections/admin/llm-stats/widgets/top-projects-chart";
import { ClaudeExtras } from "src/sections/admin/llm-stats/widgets/claude-extras";
import { ModelTable } from "src/sections/admin/llm-stats/widgets/model-table";

export function AdminLlmStatsView() {
  const { stats, statsLoading } = useGetLlmStats();

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Статистика LLM
      </Typography>
      {statsLoading || !stats ? (
        <Typography>Загрузка…</Typography>
      ) : (
        <Stack spacing={3}>
          <HonestyBanner stats={stats} />
          <KpiRow stats={stats} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModelSplitChart stats={stats} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <HarnessSplitChart stats={stats} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TrendChart stats={stats} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ActivityHeatmap stats={stats} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TopProjectsChart stats={stats} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModelTable stats={stats} />
            </Grid>
          </Grid>
          <ClaudeExtras stats={stats} />
        </Stack>
      )}
    </Container>
  );
}
```

- [ ] **Step 2: Create the page (admin-guarded, mirrors audit-logs page)**

Create `src/app/dashboard/admin/llm-stats/page.tsx`:

```tsx
"use client";

import { useAuthContext } from "src/auth/hooks";
import { RoleBasedGuard } from "src/auth/guard";
import { AdminLlmStatsView } from "src/sections/admin/llm-stats/llm-stats-view";

export default function AdminLlmStatsPage() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={["admin"]}>
      <AdminLlmStatsView />
    </RoleBasedGuard>
  );
}
```

- [ ] **Step 3: Add the path**

In `src/routes/paths.ts`, add `llmStats: string;` to the `admin` block of the `Paths` interface (after `auditLogs: string;`, line ~57):

```ts
admin: {
  users: string;
  posts: string;
  auditLogs: string;
  llmStats: string;
}
```

And in the `paths` value object's admin block (after `auditLogs`, line ~115):

```ts
    admin: {
      users: `${ROOTS.DASHBOARD}/admin/users`,
      posts: `${ROOTS.DASHBOARD}/admin/posts`,
      auditLogs: `${ROOTS.DASHBOARD}/admin/audit-logs`,
      llmStats: `${ROOTS.DASHBOARD}/admin/llm-stats`,
    },
```

- [ ] **Step 4: Add the nav item**

In `src/layouts/config-nav-dashboard.tsx`, inside the admin `items` array (after the "Журнал аудита" item, line ~61), add:

```tsx
        {
          title: "Статистика LLM",
          path: paths.dashboard.admin.llmStats,
          icon: ICONS.dashboard,
        },
```

- [ ] **Step 5: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.

- [ ] **Step 6: Visual verify (dev server, preview tools)**

Start the worktree dev server (symlink node_modules, copy `.env.local`, next WITHOUT `--turbo`, port 3055). Log in as the local admin (demo@minimals.cc / Demo!Admin2026), navigate to `/dashboard/admin/llm-stats`. Use the preview tools: snapshot for structure, screenshot for the charts, console logs for errors. Confirm KPIs are non-zero and charts render.

- [ ] **Step 7: Commit**

```bash
git add "src/sections/admin/llm-stats/llm-stats-view.tsx" "src/app/dashboard/admin/llm-stats/page.tsx" src/routes/paths.ts src/layouts/config-nav-dashboard.tsx
git commit -m "feat(llm-stats): dashboard view, admin page, nav + route wiring"
```

**Improvement/automation idea:** Add a small "Статистика LLM" teaser card to the main `/dashboard` home with the top KPI, linking into the full page.

---

## Task 14: Final verification + knip + docs

**Files:**

- Modify: `CLAUDE.md` or `AGENTS.md` (document the feature is local-only)

- [ ] **Step 1: Full quality gate**

Run:

```bash
npm run test:unit && npx tsc --noEmit && npm run lint && npm run knip
```

Expected: tests PASS, tsc 0 errors, lint clean, knip reports no NEW unused files (the new files are all referenced).

- [ ] **Step 2: Document the feature**

Add a short note to `AGENTS.md` (or `CLAUDE.md`) under a new "LLM stats dashboard" heading: route `/dashboard/admin/llm-stats`, local-only (reads `~/.claude`, `~/.codex`, `~/.local/share/opencode`), returns empty on prod, parsing lives in `src/server/llm-stats/`, add a harness = add an adapter + register in `scan.ts`.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs(llm-stats): document local-only LLM stats dashboard"
```

**Improvement/automation idea (capstone):** Add a scheduled local job (cron / `ScheduleWakeup`) that refreshes the incremental cache nightly and, reusing the backend's Nodemailer, emails a weekly "AI usage digest" (top model, tokens, est. cost, busiest day).

---

## Self-Review

**Spec coverage:**

- Adapters (CC/Codex/OpenCode) → Tasks 4–6. ✅
- Unified event → Task 1. ✅
- Aggregate/StatsBundle → Task 7. ✅
- Incremental cache → flagged as improvement in Tasks 4/8 (V1 reads fully; cache is the first follow-up, intentionally deferred to keep V1 shippable). ✅ (scoped, not silently dropped)
- Cost estimation → Task 3. ✅
- API route + empty-on-prod → Task 9. ✅
- Placement (`/dashboard/admin/llm-stats`, admin guard, nav) → Task 13. ✅
- Widgets (KPIs, model/harness split, trend, heatmap, projects, claude extras, table, honesty banner) → Tasks 11–12. ✅
- Testing (adapters dedup/diff, normalize, pricing, aggregate) → Tasks 2–8. ✅
- Cursor/Gemini/Continue/Goose/Copilot adapters → V2/V3, explicitly out of this plan's scope per the spec's build tiers. ✅
- Per-task improvement hook → present on every task. ✅

**Placeholder scan:** No TBD/TODO; every code step has full code; every command has expected output.

**Type consistency:** `UsageEvent`, `StatsBundle`, `ModelStat`, `HarnessId` defined once in Task 1 and used verbatim downstream. `scanClaudeCode`/`scanCodex`/`scanOpenCode`/`runAdapters`/`aggregate`/`costFor` signatures match between definition and call sites. View component named `AdminLlmStatsView` consistently in view + page.

One deviation from the spec naming: the cache layer (`cache.ts`) is deferred to a follow-up rather than built in V1 — called out above so it isn't a silent gap.

```

```
