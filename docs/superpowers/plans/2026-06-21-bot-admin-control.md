# Bot Admin Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a blog admin see and drive the ai-bot-tg news-bot's active rewrite model, "без LLM" (mock) toggle, and live health from the dashboard admin panel.

**Architecture:** Admin browser → blog-backend `/api/admin/bot/*` (requireAuth+requireAdmin) → bot `127.0.0.1:CONTROL_PORT` `/control/*` (Bearer `BOT_CONTROL_TOKEN`, loopback-only). The bot already has the multi-provider rewrite abstraction (`providers.ts`, `models.ts`, `store` settings) on branch `claude/pensive-leakey-8141bc`; this plan adds a mock override + a control HTTP server, a backend proxy, and a frontend section. V1 admin-controllable providers = `glm | deepseek | mock` only.

**Tech Stack:** ai-bot-tg (TypeScript ESM, `node:http`, better-sqlite3, vitest); blog-app-mui-backend (Next.js 14 API routes, `pg`, Jest+Supertest+pg-mem); blog-app-mui-frontend (Next.js 15, React 19, MUI v7, SWR).

**Spec:** `blog-app-mui-frontend/docs/superpowers/specs/2026-06-21-bot-admin-control-design.md`

**Deploy order:** bot → backend → frontend, each merged+deployed before the next. The bot's `BOT_CONTROL_TOKEN` is optional → shipping bot code without the env var added does not crash the publish pipeline.

---

## Repo & branch map (read before starting)

| Repo     | Path                                               | Working branch                                                                          |
| -------- | -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| bot      | `/Users/talalaev-m/projects/ai-bot-tg`             | NEW branch off `claude/pensive-leakey-8141bc` (the model work lives there, NOT on main) |
| backend  | `/Users/talalaev-m/projects/blog-app-mui-backend`  | NEW branch off `main`                                                                   |
| frontend | `/Users/talalaev-m/projects/blog-app-mui-frontend` | current worktree `claude/recursing-raman-cea65f`                                        |

**Bot branch trap:** the bot's `providers.ts`/`models.ts`/`store` settings table exist only on `claude/pensive-leakey-8141bc`. Start Group A by checking that branch out, not main.

---

## File structure

### Group A — bot (`ai-bot-tg`)

- `src/store.ts` (modify) — add `mock_override` get/set/clear.
- `src/providers.ts` (modify) — `resolveActiveProvider` honors mock override; add `CONTROL_PROVIDERS` whitelist + `isControlProvider`.
- `src/control-server.ts` (create) — `node:http` server, the 5 `/control/*` endpoints, Bearer auth, model enrichment.
- `src/config.ts` (modify) — `CONTROL_PORT`, `BOT_CONTROL_TOKEN` (optional).
- `src/index.ts` (modify) — start/stop the control server.
- `tests/store.test.ts`, `tests/providers.test.ts`, `tests/control-server.test.ts` — coverage.

### Group B — backend (`blog-app-mui-backend`)

- `src/services/bot-control.ts` (create) — typed client to the bot, ECONNREFUSED→unreachable.
- `src/pages/api/admin/bot/{status,providers,models,model,mock}.ts` (create) — thin proxy routes.
- `src/tests/bot-control.test.ts` (create) — auth gating + ECONNREFUSED→503/isAlive:false.
- `.env.example` (modify) — `BOT_CONTROL_URL`, `BOT_CONTROL_TOKEN`.

### Group C — frontend (`blog-app-mui-frontend`)

- `src/utils/axios.ts` (modify) — `endpoints.admin.bot.*`.
- `src/actions/admin.ts` (modify) — SWR hooks + POST actions.
- `src/sections/admin/bot-types.ts` (create) — bot view types (kept separate from the audit-logs `types.ts` to honor section-isolation).
- `src/sections/admin/bot-const.ts` (create) — provider names, tier icons, labels.
- `src/sections/admin/bot-utils.ts` (create) — health color, model label helpers.
- `src/sections/admin/admin-bot-view.tsx` (create) — the panel.
- `src/app/dashboard/admin/bot/page.tsx` (create) — guarded page.
- `src/routes/paths.ts` (modify) — `dashboard.admin.bot`.
- `src/layouts/config-nav-dashboard.tsx` (modify) — nav item.

---

# GROUP A — BOT (deploy first)

### Task A0: Branch setup

- [ ] **Step 1: Create the working branch off the model branch**

```bash
cd /Users/talalaev-m/projects/ai-bot-tg
git checkout claude/pensive-leakey-8141bc
git pull --ff-only 2>/dev/null || true
git checkout -b feat/control-server
```

- [ ] **Step 2: Verify the preconditions exist (not on main)**

Run: `ls src/providers.ts src/models.ts && grep -c "settings" src/store.ts`
Expected: both files listed, grep count ≥ 1. If not, you are on the wrong branch — stop.

- [ ] **Step 3: Confirm the test runner works**

Run: `npm test 2>&1 | tail -5`
Expected: existing suite passes (green). Baseline before changes.

---

### Task A1: Mock override in the store

**Files:**

- Modify: `src/store.ts`
- Test: `tests/store.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/store.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { CandidateStore } from "../src/store.js";

describe("mock override", () => {
  it("returns null when unset", () => {
    const store = new CandidateStore(":memory:");
    expect(store.getMockOverride()).toBeNull();
    store.close();
  });

  it("round-trips an enabled flag", () => {
    const store = new CandidateStore(":memory:");
    store.setMockOverride(true);
    expect(store.getMockOverride()).toEqual({ enabled: true });
    store.setMockOverride(false);
    expect(store.getMockOverride()).toEqual({ enabled: false });
    store.close();
  });

  it("clears back to null", () => {
    const store = new CandidateStore(":memory:");
    store.setMockOverride(true);
    store.clearMockOverride();
    expect(store.getMockOverride()).toBeNull();
    store.close();
  });

  it("returns null on a corrupt row", () => {
    const store = new CandidateStore(":memory:");
    store.setRawSetting("mock_override", "not json");
    expect(store.getMockOverride()).toBeNull();
    store.close();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- tests/store.test.ts`
Expected: FAIL — `getMockOverride is not a function`.

- [ ] **Step 3: Implement in `src/store.ts`**

Below the `MODEL_OVERRIDE_KEY` constant (~line 35), add:

```ts
/** The single settings row holding the runtime mock ("без LLM") override. */
const MOCK_OVERRIDE_KEY = "mock_override";

/** Runtime override of mock mode, stored in `settings`. */
export interface MockOverride {
  enabled: boolean;
}
```

After `clearModelOverride()` (~line 323), add:

```ts
/**
 * The active mock override, or null if none is set. When set, it is strictly
 * authoritative over the env REWRITE_MOCK (so an admin toggling mock OFF in the
 * panel truly disables it even if REWRITE_MOCK=1). A corrupt row returns null.
 */
getMockOverride(): MockOverride | null {
  const raw = this.getRawSetting(MOCK_OVERRIDE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<MockOverride>;
    if (typeof parsed.enabled === 'boolean') {
      return { enabled: parsed.enabled };
    }
    return null;
  } catch {
    return null;
  }
}

/** Sets (upserts) the mock override. */
setMockOverride(enabled: boolean): void {
  this.setRawSetting(MOCK_OVERRIDE_KEY, JSON.stringify({ enabled }));
}

/** Clears the mock override; resolution then falls back to env REWRITE_MOCK. */
clearMockOverride(): void {
  this.db.prepare('DELETE FROM settings WHERE key = ?').run(MOCK_OVERRIDE_KEY);
}
```

Note: `getRawSetting` is `private` — these methods are on the same class so they can call it.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- tests/store.test.ts`
Expected: PASS (all 4 new cases).

- [ ] **Step 5: Commit**

```bash
git add src/store.ts tests/store.test.ts
git commit -m "feat(store): mock_override settings row + get/set/clear"
```

---

### Task A2: resolveActiveProvider honors the mock override

**Files:**

- Modify: `src/providers.ts`
- Test: `tests/providers.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/providers.test.ts`:

```ts
import { CandidateStore } from "../src/store.js";
import { resolveActiveProvider } from "../src/providers.js";

describe("mock override precedence", () => {
  it("db mock=true forces the mock provider", () => {
    const store = new CandidateStore(":memory:");
    store.setModelOverride("glm", "glm-4.7-flash");
    store.setMockOverride(true);
    expect(resolveActiveProvider(store)).toEqual({
      provider: "mock",
      model: "mock",
    });
    store.close();
  });

  it("db mock=false beats env REWRITE_MOCK and uses the model override", () => {
    const store = new CandidateStore(":memory:");
    store.setModelOverride("glm", "glm-4.7-flash");
    store.setMockOverride(false);
    // Even if CONFIG.REWRITE_MOCK were true, the db override wins.
    expect(resolveActiveProvider(store)).toEqual({
      provider: "glm",
      model: "glm-4.7-flash",
    });
    store.close();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- tests/providers.test.ts`
Expected: FAIL — first case returns the glm override (mock not yet honored).

- [ ] **Step 3: Implement in `src/providers.ts`**

In `resolveActiveProvider`, replace the leading `if (CONFIG.REWRITE_MOCK)` block:

```ts
export function resolveActiveProvider(store: CandidateStore): {
  provider: ProviderName;
  model: string;
} {
  const mockDb = store.getMockOverride();
  const forceMock = mockDb ? mockDb.enabled : CONFIG.REWRITE_MOCK;
  if (forceMock) {
    return { provider: 'mock', model: PROVIDERS.mock.defaultModel };
  }
  const override = store.getModelOverride();
  // ...unchanged override + env-default logic below...
```

Leave the rest of the function unchanged.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- tests/providers.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/providers.ts tests/providers.test.ts
git commit -m "feat(providers): db mock override is authoritative over env"
```

---

### Task A3: Control-provider whitelist + helpers

**Files:**

- Modify: `src/providers.ts`
- Test: `tests/providers.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/providers.test.ts`:

```ts
import { CONTROL_PROVIDERS, isControlProvider } from "../src/providers.js";

describe("control provider whitelist", () => {
  it("exposes only glm, deepseek, mock", () => {
    expect([...CONTROL_PROVIDERS]).toEqual(["glm", "deepseek", "mock"]);
  });
  it("accepts whitelisted, rejects others", () => {
    expect(isControlProvider("glm")).toBe(true);
    expect(isControlProvider("mock")).toBe(true);
    expect(isControlProvider("anthropic")).toBe(false);
    expect(isControlProvider("gemini")).toBe(false);
    expect(isControlProvider("nonsense")).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- tests/providers.test.ts`
Expected: FAIL — `CONTROL_PROVIDERS` undefined.

- [ ] **Step 3: Implement in `src/providers.ts`**

After the `ProviderName` type and `PROVIDERS` registry, add:

```ts
/** Providers the admin panel may control in V1 (anthropic/gemini excluded). */
export const CONTROL_PROVIDERS = ["glm", "deepseek", "mock"] as const;

/** A provider name the admin panel is allowed to select. */
export type ControlProviderName = (typeof CONTROL_PROVIDERS)[number];

/** True if a string is an admin-controllable provider name. */
export function isControlProvider(value: string): value is ControlProviderName {
  return (CONTROL_PROVIDERS as readonly string[]).includes(value);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- tests/providers.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/providers.ts tests/providers.test.ts
git commit -m "feat(providers): CONTROL_PROVIDERS whitelist (glm/deepseek/mock)"
```

---

### Task A4: Config — CONTROL_PORT + BOT_CONTROL_TOKEN (optional)

**Files:**

- Modify: `src/config.ts`

- [ ] **Step 1: Add the env fields**

In `EnvSchema` (after `BOT_API_TOKEN`), add:

```ts
  /** Port for the localhost-only admin control server. */
  CONTROL_PORT: z.coerce.number().int().positive().default(8455),
  /**
   * Shared secret for the backend→bot control API. OPTIONAL: when unset, the
   * control server is NOT started and the bot runs/publishes normally — so
   * deploying this code without the var added cannot crash the pipeline. Min 16
   * chars when present.
   */
  BOT_CONTROL_TOKEN: z.string().min(16, 'BOT_CONTROL_TOKEN must be >= 16 chars').optional(),
```

- [ ] **Step 2: Verify the config still loads**

Run: `npx tsx -e "import('./src/config.js').then(()=>console.log('ok'))"`
Expected: prints `ok` (assuming a valid `.env`). If it exits 1, the `.env` is missing required vars unrelated to this change.

- [ ] **Step 3: Document in `.env.example`**

Add to `.env.example`:

```
# Admin control server (backend -> bot). Optional: unset = control server off.
CONTROL_PORT=8455
BOT_CONTROL_TOKEN=
```

- [ ] **Step 4: Commit**

```bash
git add src/config.ts .env.example
git commit -m "feat(config): optional CONTROL_PORT + BOT_CONTROL_TOKEN"
```

---

### Task A5: Control server — module + auth + status

**Files:**

- Create: `src/control-server.ts`
- Test: `tests/control-server.test.ts`

- [ ] **Step 1: Write the failing test (auth + status)**

Create `tests/control-server.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import type { AddressInfo } from "node:net";
import { CandidateStore } from "../src/store.js";
import { startControlServer } from "../src/control-server.js";

const TOKEN = "test-control-token-0123456789";

function makeServer() {
  const store = new CandidateStore(":memory:");
  const handle = startControlServer({
    port: 0,
    token: TOKEN,
    store,
    nextRun: () => null,
  });
  const { port } = handle.server.address() as AddressInfo;
  return { store, handle, base: `http://127.0.0.1:${port}` };
}

describe("control server auth", () => {
  let ctx: ReturnType<typeof makeServer>;
  beforeEach(() => {
    ctx = makeServer();
  });
  afterEach(() => {
    ctx.handle.close();
    ctx.store.close();
  });

  it("401 without Authorization", async () => {
    const r = await fetch(`${ctx.base}/control/status`);
    expect(r.status).toBe(401);
  });

  it("403 with a wrong token", async () => {
    const r = await fetch(`${ctx.base}/control/status`, {
      headers: { Authorization: "Bearer wrong-token-also-16chars" },
    });
    expect(r.status).toBe(403);
  });

  it("200 + status shape with the right token", async () => {
    const r = await fetch(`${ctx.base}/control/status`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body).toMatchObject({
      provider: expect.any(String),
      model: expect.any(String),
      isMockEnabled: false,
    });
  });

  it("binds to loopback only", () => {
    const addr = ctx.handle.server.address() as AddressInfo;
    expect(addr.address === "127.0.0.1" || addr.address === "::1").toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- tests/control-server.test.ts`
Expected: FAIL — cannot find `../src/control-server.js`.

- [ ] **Step 3: Implement `src/control-server.ts`**

```ts
import {
  createServer,
  type Server,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { timingSafeEqual } from "node:crypto";

import {
  PROVIDERS,
  resolveActiveProvider,
  isControlProvider,
  CONTROL_PROVIDERS,
} from "./providers.js";
import { MODEL_PRICES } from "./providers.js";
import { listModels, pingModel } from "./models.js";
import type { ControlProviderName } from "./providers.js";
import type { CandidateStore } from "./store.js";

export interface ControlServerOptions {
  port: number;
  token: string;
  store: CandidateStore;
  /** Next scheduled run, or null. Kept for future use; not in V1 status body. */
  nextRun: () => Date | null;
}

export interface ControlServerHandle {
  server: Server;
  close: () => Promise<void>;
}

interface EnrichedModel {
  id: string;
  tier: "free" | "paid";
  note?: string;
}

/** Constant-time token comparison; false on any length mismatch. */
function tokenMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Joins listModels output with MODEL_PRICES into {id,tier,note} objects. */
function enrich(models: string[]): EnrichedModel[] {
  return models.map((id) => {
    const price = MODEL_PRICES[id];
    if (!price) return { id, tier: "paid" };
    return price.note
      ? { id, tier: price.tier, note: price.note }
      : { id, tier: price.tier };
  });
}

function send(res: ServerResponse, status: number, body: unknown): void {
  const json = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(json);
}

/** Reads a JSON request body, capped at 64KB. Resolves {} on empty/invalid. */
function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 64_000) raw = raw.slice(0, 64_000);
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        const parsed: unknown = JSON.parse(raw);
        resolve(
          typeof parsed === "object" && parsed !== null
            ? (parsed as Record<string, unknown>)
            : {},
        );
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

export function startControlServer(
  opts: ControlServerOptions,
): ControlServerHandle {
  const { port, token, store } = opts;

  const server = createServer((req, res) => {
    void handle(req, res).catch((err: unknown) => {
      // Never log headers/body — only the error code and path.
      // eslint-disable-next-line no-console
      console.error(
        `[control] ${req.method} ${req.url} failed: ${err instanceof Error ? err.message : "error"}`,
      );
      if (!res.headersSent) send(res, 500, { error: "Internal error" });
    });
  });

  async function handle(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return send(res, 401, { error: "Unauthorized" });
    }
    if (!tokenMatches(auth.slice("Bearer ".length), token)) {
      return send(res, 403, { error: "Forbidden" });
    }

    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const path = url.pathname;
    const method = req.method ?? "GET";

    if (method === "GET" && path === "/control/status") {
      const { provider, model } = resolveActiveProvider(store);
      const mockDb = store.getMockOverride();
      const isMockEnabled = provider === "mock" || (mockDb?.enabled ?? false);
      return send(res, 200, { provider, model, isMockEnabled });
    }

    if (method === "GET" && path === "/control/providers") {
      const providers = CONTROL_PROVIDERS.map((name) => ({
        name,
        label: PROVIDERS[name].label,
        hasKey: Boolean(PROVIDERS[name].apiKey()),
      }));
      return send(res, 200, { providers });
    }

    if (method === "GET" && path === "/control/models") {
      const provider = url.searchParams.get("provider") ?? "";
      if (!isControlProvider(provider)) {
        return send(res, 400, { error: "Unknown provider" });
      }
      const models = enrich(await listModels(provider));
      return send(res, 200, { provider, models });
    }

    if (method === "POST" && path === "/control/model") {
      const body = await readJson(req);
      const provider = typeof body.provider === "string" ? body.provider : "";
      const model = typeof body.model === "string" ? body.model : "";
      if (!isControlProvider(provider) || !model) {
        return send(res, 400, { error: "Unknown provider or empty model" });
      }
      const ping = await pingModel(provider, model);
      if (!ping.ok) {
        return send(res, 400, { error: ping.error });
      }
      store.setModelOverride(provider, model);
      // mock provider has a real probe; treat all V1 selections as pinged.
      return send(res, 200, { ok: true, validation: "pinged" });
    }

    if (method === "POST" && path === "/control/mock") {
      const body = await readJson(req);
      if (typeof body.enabled !== "boolean") {
        return send(res, 400, { error: "enabled must be a boolean" });
      }
      store.setMockOverride(body.enabled);
      return send(res, 200, { ok: true, isMockEnabled: body.enabled });
    }

    return send(res, 404, { error: "Not found" });
  }

  server.listen(port, "127.0.0.1");

  return {
    server,
    close: () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
      }),
  };
}
```

- [ ] **Step 4: Run to verify the auth/status tests pass**

Run: `npm test -- tests/control-server.test.ts`
Expected: PASS (4 cases).

- [ ] **Step 5: Commit**

```bash
git add src/control-server.ts tests/control-server.test.ts
git commit -m "feat(control): localhost control server — auth + status"
```

---

### Task A6: Control server — providers / models / model / mock endpoint tests

**Files:**

- Test: `tests/control-server.test.ts`

- [ ] **Step 1: Add endpoint behavior tests**

Append to `tests/control-server.test.ts`:

```ts
describe("control server endpoints", () => {
  let ctx: ReturnType<typeof makeServer>;
  const auth = { Authorization: `Bearer ${TOKEN}` };
  beforeEach(() => {
    ctx = makeServer();
  });
  afterEach(() => {
    ctx.handle.close();
    ctx.store.close();
  });

  it("providers returns only glm, deepseek, mock", async () => {
    const r = await fetch(`${ctx.base}/control/providers`, { headers: auth });
    const body = await r.json();
    expect(body.providers.map((p: { name: string }) => p.name)).toEqual([
      "glm",
      "deepseek",
      "mock",
    ]);
  });

  it("models 400s an unknown provider", async () => {
    const r = await fetch(`${ctx.base}/control/models?provider=anthropic`, {
      headers: auth,
    });
    expect(r.status).toBe(400);
  });

  it("models returns enriched objects for mock", async () => {
    const r = await fetch(`${ctx.base}/control/models?provider=mock`, {
      headers: auth,
    });
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(Array.isArray(body.models)).toBe(true);
    expect(body.models[0]).toHaveProperty("id");
    expect(body.models[0]).toHaveProperty("tier");
  });

  it("POST /control/model writes the override (mock pings ok)", async () => {
    const r = await fetch(`${ctx.base}/control/model`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "mock", model: "mock" }),
    });
    expect(r.status).toBe(200);
    expect(ctx.store.getModelOverride()).toEqual({
      provider: "mock",
      model: "mock",
    });
  });

  it("POST /control/model 400s an unknown provider", async () => {
    const r = await fetch(`${ctx.base}/control/model`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "anthropic",
        model: "claude-haiku-4-5",
      }),
    });
    expect(r.status).toBe(400);
  });

  it("POST /control/mock writes the override", async () => {
    const r = await fetch(`${ctx.base}/control/mock`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: true }),
    });
    expect(r.status).toBe(200);
    expect(ctx.store.getMockOverride()).toEqual({ enabled: true });
  });
});
```

- [ ] **Step 2: Run to verify they pass**

Run: `npm test -- tests/control-server.test.ts`
Expected: PASS. (mock `pingModel` returns ok; mock `listModels` returns its fallback `['mock']`.)

- [ ] **Step 3: Commit**

```bash
git add tests/control-server.test.ts
git commit -m "test(control): providers/models/model/mock endpoint coverage"
```

---

### Task A7: Wire the control server into the bot lifecycle

**Files:**

- Modify: `src/index.ts`

- [ ] **Step 1: Start the server after the job, when a token is set**

In `main()`, after `const job = scheduleDaily(scheduledRun);` and before the `console.log('[index] started...')`, add:

```ts
const controlServer = CONFIG.BOT_CONTROL_TOKEN
  ? startControlServer({
      port: CONFIG.CONTROL_PORT,
      token: CONFIG.BOT_CONTROL_TOKEN,
      store,
      nextRun: () => job.nextRun(),
    })
  : null;
// eslint-disable-next-line no-console
console.log(
  controlServer
    ? `[index] control server on 127.0.0.1:${CONFIG.CONTROL_PORT}`
    : "[index] control server disabled (BOT_CONTROL_TOKEN unset)",
);
```

Add the import at the top:

```ts
import { startControlServer } from "./control-server.js";
```

- [ ] **Step 2: Close it during shutdown**

In `shutdown`, inside the `try`, before `await bot.stop();`, add:

```ts
if (controlServer) await controlServer.close();
```

- [ ] **Step 3: Typecheck + full suite**

Run: `npm run ts 2>/dev/null || npx tsc --noEmit` then `npm test`
Expected: tsc 0 errors; all tests green.

- [ ] **Step 4: Manual smoke (optional but recommended)**

```bash
BOT_CONTROL_TOKEN=local-dev-token-0123456789 npm run dev &
sleep 4
curl -s -H "Authorization: Bearer local-dev-token-0123456789" http://127.0.0.1:8455/control/status
```

Expected: a JSON `{provider,model,isMockEnabled}` line. Then `kill %1`.

- [ ] **Step 5: Commit**

```bash
git add src/index.ts
git commit -m "feat(bot): start/stop control server in the lifecycle"
```

---

### Task A8: Bot — push & deploy

- [ ] **Step 1: Final gate**

Run: `npm run ts 2>/dev/null || npx tsc --noEmit` and `npm test`
Expected: both green.

- [ ] **Step 2: Push and open PR**

```bash
git push -u origin feat/control-server
gh pr create --fill --base main
```

- [ ] **Step 3: Add the prod env var BEFORE/with merge**

On the VDS, add `BOT_CONTROL_TOKEN` (≥16 chars, generate with `openssl rand -hex 24`) and `CONTROL_PORT=8455` to `/opt/blog-backend/.env.production` (bot's env) so the control server starts after the CI deploy. Record the token value — the backend needs the same one. Merge → CI auto-deploys → `systemctl restart blog-backend` (bot service).

- [ ] **Step 4: Verify on the VDS**

```bash
ssh <vds> 'curl -s -H "Authorization: Bearer $BOT_CONTROL_TOKEN" http://127.0.0.1:8455/control/status'
```

Expected: the status JSON. Bot layer done.

---

# GROUP B — BACKEND (deploy second)

### Task B0: Branch + env

- [ ] **Step 1: Branch off main**

```bash
cd /Users/talalaev-m/projects/blog-app-mui-backend
git checkout main && git pull --ff-only
git checkout -b feat/admin-bot-control
```

- [ ] **Step 2: Add env keys to `.env.example` and local `.env`**

`.env.example` (append):

```
# Admin → bot control proxy. URL of the bot's localhost control server + the
# SAME secret configured on the bot. BOT_API_TOKEN (bot→blog) is separate.
BOT_CONTROL_URL=http://127.0.0.1:8455
BOT_CONTROL_TOKEN=
```

Set the real `BOT_CONTROL_TOKEN` in your local `.env` to the value from Task A8.

- [ ] **Step 3: Commit the example**

```bash
git add .env.example
git commit -m "chore(env): BOT_CONTROL_URL + BOT_CONTROL_TOKEN"
```

---

### Task B1: bot-control service — types + unreachable detection

**Files:**

- Create: `src/services/bot-control.ts`
- Test: `src/tests/bot-control.test.ts`

- [ ] **Step 1: Write the failing test (unreachable → typed result)**

Create `src/tests/bot-control.test.ts`:

```ts
import { botControlService } from "@/src/services/bot-control";

describe("botControlService.getStatus", () => {
  const OLD = process.env;
  beforeEach(() => {
    process.env = {
      ...OLD,
      BOT_CONTROL_URL: "http://127.0.0.1:1",
      BOT_CONTROL_TOKEN: "x".repeat(16),
    };
  });
  afterEach(() => {
    process.env = OLD;
  });

  it("returns isAlive:false when the bot is unreachable (closed port)", async () => {
    const status = await botControlService.getStatus();
    expect(status.isAlive).toBe(false);
  });
});
```

(Port 1 is closed → ECONNREFUSED.)

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- --testPathPattern=bot-control`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/services/bot-control.ts`**

```ts
import { AppError } from "@/src/types/api";
import { HTTP } from "@/src/constants/http";

// Business logic for proxying the admin panel to the bot's localhost control
// server. No HTTP-framework types here — routes adapt the result.

export type ControlProviderName = "glm" | "deepseek" | "mock";

export interface BotModel {
  id: string;
  tier: "free" | "paid";
  note?: string;
}
export interface BotProvider {
  name: ControlProviderName;
  label: string;
  hasKey: boolean;
}
export interface BotStatus {
  isAlive: boolean;
  provider?: string;
  model?: string;
  isMockEnabled?: boolean;
}

const TIMEOUT_MS = 8_000;

function baseUrl(): string {
  const url = process.env.BOT_CONTROL_URL;
  if (!url)
    throw new AppError(
      HTTP.SERVICE_UNAVAILABLE,
      "Бот не настроен (BOT_CONTROL_URL)",
    );
  return url.replace(/\/$/, "");
}

function token(): string {
  const t = process.env.BOT_CONTROL_TOKEN;
  if (!t)
    throw new AppError(
      HTTP.SERVICE_UNAVAILABLE,
      "Бот не настроен (BOT_CONTROL_TOKEN)",
    );
  return t;
}

/** True if a thrown fetch error means the bot is unreachable (refused/timeout). */
function isUnreachable(error: unknown): boolean {
  if (error instanceof Error && error.name === "AbortError") return true;
  // undici wraps ECONNREFUSED in error.cause.code, NOT the top-level error.
  if (error instanceof Error && "cause" in error) {
    const cause = (error as { cause?: unknown }).cause;
    if (cause && typeof cause === "object" && "code" in cause) {
      const code = (cause as { code?: unknown }).code;
      return (
        code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "ETIMEDOUT"
      );
    }
  }
  return false;
}

interface RequestInitLite {
  method?: string;
  body?: unknown;
}

/** Calls the bot control server; throws AppError(503) when unreachable. */
async function call<T>(path: string, init: RequestInitLite = {}): Promise<T> {
  const { method = "GET", body } = init;
  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token()}`,
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    if (isUnreachable(error)) {
      throw new AppError(HTTP.SERVICE_UNAVAILABLE, "Бот недоступен");
    }
    throw error;
  }
  const data: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `Бот ответил ${response.status}`;
    throw new AppError(
      response.status === 400 ? HTTP.BAD_REQUEST : HTTP.SERVICE_UNAVAILABLE,
      message,
    );
  }
  return data as T;
}

async function getStatus(): Promise<BotStatus> {
  try {
    const raw = await call<{
      provider: string;
      model: string;
      isMockEnabled: boolean;
    }>("/control/status");
    return {
      isAlive: true,
      provider: raw.provider,
      model: raw.model,
      isMockEnabled: raw.isMockEnabled,
    };
  } catch (error) {
    // Status is the ONE route that swallows unreachable into isAlive:false so
    // the UI can render a "down" chip. Other (non-status) errors still throw.
    if (
      error instanceof AppError &&
      error.status === HTTP.SERVICE_UNAVAILABLE
    ) {
      return { isAlive: false };
    }
    throw error;
  }
}

async function listProviders(): Promise<BotProvider[]> {
  const raw = await call<{ providers: BotProvider[] }>("/control/providers");
  return raw.providers;
}

async function listModels(provider: string): Promise<BotModel[]> {
  const raw = await call<{ provider: string; models: BotModel[] }>(
    `/control/models?provider=${encodeURIComponent(provider)}`,
  );
  return raw.models;
}

async function setModel(
  provider: string,
  model: string,
): Promise<{ validation: string }> {
  const raw = await call<{ ok: true; validation: string }>("/control/model", {
    method: "POST",
    body: { provider, model },
  });
  return { validation: raw.validation };
}

async function setMock(enabled: boolean): Promise<{ isMockEnabled: boolean }> {
  const raw = await call<{ ok: true; isMockEnabled: boolean }>(
    "/control/mock",
    {
      method: "POST",
      body: { enabled },
    },
  );
  return { isMockEnabled: raw.isMockEnabled };
}

export const botControlService = {
  getStatus,
  listProviders,
  listModels,
  setModel,
  setMock,
};
```

Note: the one `data as T` is the JSON-boundary cast. If the repo's lint forbids it outright, replace with a per-shape runtime validator; the existing codebase uses `as` at boundaries (e.g. `req.query as {id}`), so a single boundary cast is consistent. (Frontend's no-`as` rule is stricter than backend's.)

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- --testPathPattern=bot-control`
Expected: PASS (`isAlive:false`).

- [ ] **Step 5: Commit**

```bash
git add src/services/bot-control.ts src/tests/bot-control.test.ts
git commit -m "feat(bot-control): typed client + ECONNREFUSED->unreachable"
```

---

### Task B2: Proxy routes

**Files:**

- Create: `src/pages/api/admin/bot/status.ts`, `providers.ts`, `models.ts`, `model.ts`, `mock.ts`

- [ ] **Step 1: status.ts**

```ts
import type { NextApiRequest, NextApiResponse } from "next";

import cors from "@/src/utils/cors";
import { HTTP } from "@/src/constants/http";
import { requireAuth } from "@/src/utils/auth";
import { requireAdmin } from "@/src/utils/admin";
import { ok, sendError } from "@/src/utils/response";
import { botControlService } from "@/src/services/bot-control";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  if (req.method !== "GET") {
    return res
      .status(HTTP.METHOD_NOT_ALLOWED)
      .json({ message: "Method not allowed" });
  }
  try {
    const status = await botControlService.getStatus();
    return ok(res, status);
  } catch (error) {
    return sendError(res, error);
  }
}

export default requireAuth(requireAdmin(handler));
```

- [ ] **Step 2: providers.ts**

```ts
import type { NextApiRequest, NextApiResponse } from "next";

import cors from "@/src/utils/cors";
import { HTTP } from "@/src/constants/http";
import { requireAuth } from "@/src/utils/auth";
import { requireAdmin } from "@/src/utils/admin";
import { ok, sendError } from "@/src/utils/response";
import { botControlService } from "@/src/services/bot-control";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  if (req.method !== "GET") {
    return res
      .status(HTTP.METHOD_NOT_ALLOWED)
      .json({ message: "Method not allowed" });
  }
  try {
    const providers = await botControlService.listProviders();
    return ok(res, { providers });
  } catch (error) {
    return sendError(res, error);
  }
}

export default requireAuth(requireAdmin(handler));
```

- [ ] **Step 3: models.ts**

```ts
import type { NextApiRequest, NextApiResponse } from "next";

import cors from "@/src/utils/cors";
import { HTTP } from "@/src/constants/http";
import { AppError } from "@/src/types/api";
import { requireAuth } from "@/src/utils/auth";
import { requireAdmin } from "@/src/utils/admin";
import { ok, sendError } from "@/src/utils/response";
import { botControlService } from "@/src/services/bot-control";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  if (req.method !== "GET") {
    return res
      .status(HTTP.METHOD_NOT_ALLOWED)
      .json({ message: "Method not allowed" });
  }
  try {
    const provider =
      typeof req.query.provider === "string" ? req.query.provider : "";
    if (!provider) throw new AppError(HTTP.BAD_REQUEST, "provider is required");
    const models = await botControlService.listModels(provider);
    return ok(res, { provider, models });
  } catch (error) {
    return sendError(res, error);
  }
}

export default requireAuth(requireAdmin(handler));
```

- [ ] **Step 4: model.ts**

```ts
import type { NextApiRequest, NextApiResponse } from "next";

import cors from "@/src/utils/cors";
import { HTTP } from "@/src/constants/http";
import { AppError } from "@/src/types/api";
import { requireAuth } from "@/src/utils/auth";
import { requireAdmin } from "@/src/utils/admin";
import { ok, sendError } from "@/src/utils/response";
import { botControlService } from "@/src/services/bot-control";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  if (req.method !== "POST") {
    return res
      .status(HTTP.METHOD_NOT_ALLOWED)
      .json({ message: "Method not allowed" });
  }
  try {
    const body = req.body ?? {};
    const provider = typeof body.provider === "string" ? body.provider : "";
    const model = typeof body.model === "string" ? body.model : "";
    if (!provider || !model)
      throw new AppError(HTTP.BAD_REQUEST, "provider and model are required");
    const result = await botControlService.setModel(provider, model);
    return ok(res, result, { message: "Модель обновлена" });
  } catch (error) {
    return sendError(res, error);
  }
}

export default requireAuth(requireAdmin(handler));
```

- [ ] **Step 5: mock.ts**

```ts
import type { NextApiRequest, NextApiResponse } from "next";

import cors from "@/src/utils/cors";
import { HTTP } from "@/src/constants/http";
import { AppError } from "@/src/types/api";
import { requireAuth } from "@/src/utils/auth";
import { requireAdmin } from "@/src/utils/admin";
import { ok, sendError } from "@/src/utils/response";
import { botControlService } from "@/src/services/bot-control";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  if (req.method !== "POST") {
    return res
      .status(HTTP.METHOD_NOT_ALLOWED)
      .json({ message: "Method not allowed" });
  }
  try {
    const body = req.body ?? {};
    if (typeof body.enabled !== "boolean")
      throw new AppError(HTTP.BAD_REQUEST, "enabled must be a boolean");
    const result = await botControlService.setMock(body.enabled);
    return ok(res, result, {
      message: body.enabled ? "Mock включён" : "Mock выключен",
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export default requireAuth(requireAdmin(handler));
```

- [ ] **Step 6: Typecheck**

Run: `npm run ts`
Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/api/admin/bot
git commit -m "feat(api): admin/bot proxy routes (status/providers/models/model/mock)"
```

---

### Task B3: Auth-gating tests (supertest)

**Files:**

- Test: `src/tests/bot-control.test.ts`

- [ ] **Step 1: Add route-level auth tests**

Find an existing admin route test (e.g. `src/tests/admin-*.test.ts`) to copy the supertest harness + JWT-minting helper. Append a describe block asserting:

```ts
// Pseudo-shape — adapt imports to the repo's existing supertest harness.
describe("GET /api/admin/bot/status auth", () => {
  it("401 without a JWT", async () => {
    const res = await request(handlerStatus).get("/");
    expect(res.status).toBe(401);
  });
  it("403 for a non-admin JWT", async () => {
    const res = await request(handlerStatus)
      .get("/")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
  it("does not call the bot for a non-admin (403 before proxy)", async () => {
    // Point BOT_CONTROL_URL at a closed port; a non-admin must still get 403,
    // proving requireAdmin runs before any fetch.
    process.env.BOT_CONTROL_URL = "http://127.0.0.1:1";
    const res = await request(handlerStatus)
      .get("/")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});
```

- [ ] **Step 2: Run**

Run: `npm test -- --testPathPattern=bot-control`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/tests/bot-control.test.ts
git commit -m "test(api): admin/bot auth gating (401/403, 403-before-proxy)"
```

---

### Task B4: Backend — push & deploy

- [ ] **Step 1: Final gate**

Run: `npm run ts && npm test`
Expected: both green.

- [ ] **Step 2: Ensure prod env vars on the VDS**

Add `BOT_CONTROL_URL=http://127.0.0.1:8455` and `BOT_CONTROL_TOKEN=<same as bot>` to the backend's `/opt/blog-backend/.env.production`.

- [ ] **Step 3: Push, PR, merge → CI auto-deploys**

```bash
git push -u origin feat/admin-bot-control
gh pr create --fill --base main
```

- [ ] **Step 4: Verify against prod**

```bash
TOKEN=<admin-jwt>  # from a logged-in admin session
curl -s https://api.talalaev.su:8444/api/admin/bot/status -H "Authorization: Bearer $TOKEN"
```

Expected: `{success:true,data:{isAlive:true,provider,model,isMockEnabled}}`. Backend layer done.

---

# GROUP C — FRONTEND (deploy last, this worktree)

### Task C1: Endpoints + paths

**Files:**

- Modify: `src/utils/axios.ts`, `src/routes/paths.ts`

- [ ] **Step 1: Add bot endpoints**

In `src/utils/axios.ts`, inside `endpoints.admin`, after `auditLogs`:

```ts
    bot: {
      status: "/api/admin/bot/status",
      providers: "/api/admin/bot/providers",
      models: (provider: string) => `/api/admin/bot/models?provider=${provider}`,
      model: "/api/admin/bot/model",
      mock: "/api/admin/bot/mock",
    },
```

- [ ] **Step 2: Add the path**

In `src/routes/paths.ts`, in the `admin:` type block (~line 54) add `bot: string;`, and in the values block (~line 115) after `auditLogs`:

```ts
      bot: `${ROOTS.DASHBOARD}/admin/bot`,
```

- [ ] **Step 3: Typecheck**

Run: `cd /Users/talalaev-m/projects/blog-app-mui-frontend/.claude/worktrees/recursing-raman-cea65f && npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/utils/axios.ts src/routes/paths.ts
git commit -m "feat(admin): bot control endpoints + path"
```

---

### Task C2: Section types / const / utils

**Files:**

- Create: `src/sections/admin/bot-types.ts`, `bot-const.ts`, `bot-utils.ts`

- [ ] **Step 1: bot-types.ts**

```ts
// Типы для admin-bot-view. Без логики/JSX.

export type ControlProviderName = "glm" | "deepseek" | "mock";

export type BotModel = {
  id: string;
  tier: "free" | "paid";
  note?: string;
};

export type BotProvider = {
  name: ControlProviderName;
  label: string;
  hasKey: boolean;
};

export type BotStatus = {
  isAlive: boolean;
  provider?: string;
  model?: string;
  isMockEnabled?: boolean;
};
```

- [ ] **Step 2: bot-const.ts**

```ts
// Статические данные для admin-bot-view. Без логики/JSX.

import type { ControlProviderName } from "./bot-types";

export const BOT_PROVIDER_NAMES: readonly ControlProviderName[] = [
  "glm",
  "deepseek",
  "mock",
] as const;

export const TIER_ICON: Record<"free" | "paid", string> = {
  free: "🆓",
  paid: "💲",
};
```

- [ ] **Step 3: bot-utils.ts**

```ts
// Чистые хелперы для admin-bot-view. Без JSX.

import type { BotModel } from "./bot-types";
import { TIER_ICON } from "./bot-const";

// Цвет чипа здоровья по флагу isAlive.
export function getHealthColor(isAlive: boolean): "success" | "error" {
  return isAlive ? "success" : "error";
}

// Подпись модели: "glm-4.7-flash 🆓 $..." — иконка тира + note.
export function formatModelLabel(model: BotModel): string {
  const icon = TIER_ICON[model.tier];
  return model.note
    ? `${model.id} ${icon} ${model.note}`
    : `${model.id} ${icon}`;
}
```

- [ ] **Step 4: Typecheck + commit**

Run: `npx tsc --noEmit`
Expected: 0 errors.

```bash
git add src/sections/admin/bot-types.ts src/sections/admin/bot-const.ts src/sections/admin/bot-utils.ts
git commit -m "feat(admin): bot view types/const/utils"
```

---

### Task C3: SWR hooks + POST actions

**Files:**

- Modify: `src/actions/admin.ts`

- [ ] **Step 1: Add hooks + actions at the end of `src/actions/admin.ts`**

```ts
// ----------------------------------------------------------------------
// Bot control

import type {
  BotStatus,
  BotProvider,
  BotModel,
  ControlProviderName,
} from "src/sections/admin/bot-types";

interface BotStatusResponse {
  data: BotStatus;
}
interface BotProvidersResponse {
  data: { providers: BotProvider[] };
}
interface BotModelsResponse {
  data: { provider: string; models: BotModel[] };
}

// Статус опрашивается с refetch-при-фокусе: Telegram /model мог сменить модель
// в обход панели — на возврате во вкладку показываем актуальное.
const botStatusOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: false,
};

export function useGetBotStatus(accessToken?: string) {
  const key = accessToken
    ? [
        endpoints.admin.bot.status,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      ]
    : null;
  const { data, isLoading, error, mutate } = useSWR<BotStatusResponse>(
    key,
    fetcher,
    botStatusOptions,
  );
  return useMemo(
    () => ({
      botStatus: data?.data ?? null,
      botStatusLoading: isLoading,
      botStatusError: error,
      botStatusMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}

export function useGetBotProviders(accessToken?: string) {
  const key = accessToken
    ? [
        endpoints.admin.bot.providers,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      ]
    : null;
  const { data, isLoading, error } = useSWR<BotProvidersResponse>(
    key,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      botProviders: data?.data.providers ?? [],
      botProvidersLoading: isLoading,
      botProvidersError: error,
    }),
    [data, isLoading, error],
  );
}

export function useGetBotModels(
  provider: ControlProviderName | null,
  accessToken?: string,
) {
  const key =
    accessToken && provider
      ? [
          endpoints.admin.bot.models(provider),
          { headers: { Authorization: `Bearer ${accessToken}` } },
        ]
      : null;
  const { data, isLoading, error } = useSWR<BotModelsResponse>(
    key,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      botModels: data?.data.models ?? [],
      botModelsLoading: isLoading,
      botModelsError: error,
    }),
    [data, isLoading, error],
  );
}

export async function setBotModel(
  provider: ControlProviderName,
  model: string,
) {
  await axiosInstance.post(endpoints.admin.bot.model, { provider, model });
}

export async function setBotMock(enabled: boolean) {
  await axiosInstance.post(endpoints.admin.bot.mock, { enabled });
}
```

(Imports `useSWR`, `useMemo`, `axiosInstance`, `fetcher`, `endpoints`, `swrOptions` already exist at the top of the file.)

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/actions/admin.ts
git commit -m "feat(admin): bot SWR hooks + set model/mock actions"
```

---

### Task C4: The admin-bot view

**Files:**

- Create: `src/sections/admin/admin-bot-view.tsx`

- [ ] **Step 1: Implement the view**

```tsx
"use client";

import { useState } from "react";

import {
  Box,
  Card,
  Chip,
  Stack,
  Alert,
  Switch,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";

import { useAuthContext } from "src/auth/hooks";
import {
  setBotMock,
  setBotModel,
  useGetBotStatus,
  useGetBotModels,
  useGetBotProviders,
} from "src/actions/admin";

import { getHealthColor, formatModelLabel } from "./bot-utils";
import type { ControlProviderName } from "./bot-types";

export function AdminBotView() {
  const { user } = useAuthContext();
  const accessToken = user?.accessToken;

  const { botStatus, botStatusLoading, botStatusMutate } =
    useGetBotStatus(accessToken);
  const { botProviders } = useGetBotProviders(accessToken);

  const [provider, setProvider] = useState<ControlProviderName | null>(null);
  const { botModels } = useGetBotModels(provider, accessToken);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAlive = botStatus?.isAlive ?? false;
  const disabled = !isAlive || busy;

  const handleSetModel = async (model: string) => {
    if (!provider) return;
    setBusy(true);
    setError(null);
    try {
      await setBotModel(provider, model);
      await botStatusMutate();
    } catch {
      setError(
        "Не удалось переключить модель — бот отклонил выбор или недоступен.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleToggleMock = async (enabled: boolean) => {
    setBusy(true);
    setError(null);
    try {
      await setBotMock(enabled);
      await botStatusMutate();
    } catch {
      setError("Не удалось переключить режим mock.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        AI-бот
      </Typography>

      {botStatusLoading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={isAlive ? "Бот в сети" : "Бот недоступен"}
                color={getHealthColor(isAlive)}
                size="small"
              />
              {isAlive && (
                <Typography variant="body2" color="text.secondary">
                  Активная модель: <b>{botStatus?.provider}</b> /{" "}
                  {botStatus?.model}
                  {botStatus?.isMockEnabled ? " · режим без LLM" : ""}
                </Typography>
              )}
            </Stack>
          </Card>

          {!isAlive && (
            <Alert severity="error">
              Бот не отвечает. Управление недоступно, пока он не вернётся в
              сеть.
            </Alert>
          )}

          {error && <Alert severity="warning">{error}</Alert>}

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Модель переработки
            </Typography>
            <Stack spacing={2}>
              <FormControl fullWidth disabled={disabled}>
                <InputLabel>Провайдер</InputLabel>
                <Select
                  label="Провайдер"
                  value={provider ?? ""}
                  onChange={(e) =>
                    setProvider(e.target.value as ControlProviderName)
                  }
                >
                  {botProviders.map((p) => (
                    <MenuItem
                      key={p.name}
                      value={p.name}
                      disabled={!p.hasKey && p.name !== "mock"}
                    >
                      {p.label}
                      {!p.hasKey && p.name !== "mock" ? " — нет ключа" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {provider && provider !== "mock" && (
                <FormControl fullWidth disabled={disabled}>
                  <InputLabel>Модель</InputLabel>
                  <Select
                    label="Модель"
                    value={botStatus?.model ?? ""}
                    onChange={(e) => handleSetModel(e.target.value)}
                  >
                    {botModels.length === 0 ? (
                      <MenuItem disabled value="">
                        нет доступных моделей
                      </MenuItem>
                    ) : (
                      botModels.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                          {formatModelLabel(m)}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              )}

              {provider === "mock" && (
                <Alert severity="info">Посты уходят без переработки LLM.</Alert>
              )}
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={botStatus?.isMockEnabled ?? false}
                  disabled={disabled}
                  onChange={(e) => handleToggleMock(e.target.checked)}
                />
              }
              label="Режим «без LLM» (mock) — публиковать посты сырыми"
            />
          </Card>
        </Stack>
      )}
    </Box>
  );
}
```

Note: `e.target.value as ControlProviderName` — MUI's Select `onChange` types `value` as `string`. The value set is constrained to `botProviders[].name` (already `ControlProviderName`). If the no-`as` lint rejects this, narrow with `isControlProvider` imported from a local guard in `bot-utils.ts` instead. Add this guard to `bot-utils.ts` to avoid the cast:

```ts
import { BOT_PROVIDER_NAMES } from "./bot-const";
import type { ControlProviderName } from "./bot-types";

export function toControlProvider(value: string): ControlProviderName | null {
  return (BOT_PROVIDER_NAMES as readonly string[]).includes(value)
    ? (value as ControlProviderName)
    : null;
}
```

Then in the view: `onChange={(e) => { const p = toControlProvider(e.target.value); if (p) setProvider(p); }}`. (This still has one boundary cast inside the guard — acceptable as the single narrowing point; the rest of the code stays cast-free.)

- [ ] **Step 2: Verify `user.accessToken` exists**

Run: `grep -n "accessToken" src/auth/types.ts src/auth/context/jwt/*.tsx | head`
Expected: `accessToken` is on the user/auth shape. If the token is exposed differently (e.g. `sessionStorage.getItem`), mirror exactly how `admin-audit-logs-view.tsx` obtains its `accessToken` and use that.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/sections/admin/admin-bot-view.tsx src/sections/admin/bot-utils.ts
git commit -m "feat(admin): bot control view"
```

---

### Task C5: Page + nav

**Files:**

- Create: `src/app/dashboard/admin/bot/page.tsx`
- Modify: `src/layouts/config-nav-dashboard.tsx`

- [ ] **Step 1: page.tsx**

```tsx
"use client";

import { useAuthContext } from "src/auth/hooks";
import { RoleBasedGuard } from "src/auth/guard";
import { AdminBotView } from "src/sections/admin/admin-bot-view";

export default function AdminBotPage() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={["admin"]}>
      <AdminBotView />
    </RoleBasedGuard>
  );
}
```

- [ ] **Step 2: Nav item**

In `src/layouts/config-nav-dashboard.tsx`, after the "Журнал аудита" item (the one with `paths.dashboard.admin.auditLogs`), add:

```tsx
        {
          title: "AI-бот",
          path: paths.dashboard.admin.bot,
          icon: ICONS.dashboard,
        },
```

(Reuse `ICONS.dashboard` — same approach audit-logs uses; no new svg.)

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: tsc 0; lint clean (no `as`/`any` flagged in new files).

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/admin/bot/page.tsx src/layouts/config-nav-dashboard.tsx
git commit -m "feat(admin): bot page + sidebar nav item"
```

---

### Task C6: Preview verification

- [ ] **Step 1: Start the dev server in the worktree**

Per the worktree-preview rules: symlink `node_modules`, copy `.env.local`, run next WITHOUT `--turbo` on port 3055. Then use `preview_start`.

- [ ] **Step 2: Ensure the bot's control server is reachable from the local backend**

Run the bot locally with `BOT_CONTROL_TOKEN` set (Task A7 smoke), and the local backend with matching `BOT_CONTROL_URL`/`BOT_CONTROL_TOKEN`. (Or point the worktree's backend at a stub returning the contract shapes.)

- [ ] **Step 3: Log in as admin, open the page**

`preview_eval` to log in (`demo@minimals.cc` / token-inject flow), navigate to `/dashboard/admin/bot`, then `preview_snapshot`.
Expected: health chip "Бот в сети", active model shown, provider Select with glm/deepseek/mock.

- [ ] **Step 4: Exercise a switch**

`preview_fill`/`preview_click` the provider→model selects; `preview_network` confirms `POST /api/admin/bot/model` 200 + a follow-up `GET /api/admin/bot/status`. Toggle the mock Switch; confirm `POST /api/admin/bot/mock` + status refetch shows `isMockEnabled` flipped.

- [ ] **Step 5: Bot-down state**

Stop the local bot; reload. Expected: chip "Бот недоступен", controls disabled, the offline Alert. `preview_screenshot` both states as proof.

---

### Task C7: Frontend — push & deploy

- [ ] **Step 1: Final gate**

Run: `npx tsc --noEmit && npm run lint && npm run knip`
Expected: tsc 0, lint clean, knip 0 (no orphaned new files/exports).

- [ ] **Step 2: Push, PR, merge → Vercel auto-deploys**

```bash
git push
gh pr create --fill --base main
```

- [ ] **Step 3: Verify on prod**

Open `https://talalaev.su/dashboard/admin/bot` as an admin → health chip live, switch a model, confirm via Telegram `/model` the override applied. Done.

---

## Self-review notes (resolved during writing)

- **Spec coverage:** status/providers/models/model/mock all have bot endpoint (A5/A6), backend route (B2), frontend hook (C3) + UI (C4). Mock precedence (A2), health-backend-synth (B1), ECONNREFUSED via `error.cause` (B1), loopback bind test (A5), token timing-safe (A5), optional token degrade (A4/A7), V1 provider whitelist (A3, surfaced B/C). All covered.
- **Type consistency:** `ControlProviderName = 'glm'|'deepseek'|'mock'` is identical in bot (A3), backend (B1), frontend (C2). Model shape `{id,tier,note}` identical across A5/B1/C2. Status `{isAlive,provider,model,isMockEnabled}` identical B1/C2.
- **Known boundary casts:** backend `data as T` (B1) and the one frontend provider narrowing (C4, isolated in `toControlProvider`). Both are single, documented JSON/DOM boundaries, not pervasive. Frontend keeps its stricter no-`as` everywhere else.
- **Deploy safety:** bot token optional (no crash), backend 503s/`isAlive:false` until bot ships, frontend shows "down" until backend ships. Order bot→backend→frontend enforced by the task groups.
