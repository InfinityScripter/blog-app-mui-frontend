import type { UsageEvent } from "src/server/llm-stats/types";

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { it, expect, describe, afterEach, beforeEach } from "vitest";
import {
  loadCache,
  saveCache,
  cachedScan,
  pruneCache,
} from "src/server/llm-stats/cache";

let dir: string;
let cacheFile: string;

function evt(model: string): UsageEvent {
  return {
    harness: "claude-code",
    provider: "anthropic",
    model,
    modelFamily: "opus",
    ts: "2026-06-21T00:00:00.000Z",
    dateKey: "2026-06-21",
    weekday: 0,
    hour: 0,
    project: "demo",
    tokensIn: 10,
    tokensOut: 2,
    cacheRead: 0,
    cacheWrite: 0,
    reasoning: 0,
    costUsd: 0,
    sessionId: "s1",
    gitBranch: null,
    skill: null,
    mcpTool: null,
    agent: null,
    messageId: null,
  };
}

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "llmcache-"));
  cacheFile = path.join(dir, "index.json");
});

afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

describe("loadCache / saveCache", () => {
  it("round-trips an empty cache when the file is missing", () => {
    const c = loadCache(cacheFile);
    expect(c.files).toEqual({});
  });

  it("persists and reloads entries", () => {
    const c = loadCache(cacheFile);
    c.files["/a.jsonl"] = { mtimeMs: 1, size: 2, events: [evt("opus")] };
    saveCache(c, cacheFile);
    const reloaded = loadCache(cacheFile);
    expect(reloaded.files["/a.jsonl"].events).toHaveLength(1);
    expect(reloaded.files["/a.jsonl"].events[0].model).toBe("opus");
  });

  it("returns an empty cache when the file is corrupt", () => {
    fs.writeFileSync(cacheFile, "{not json");
    expect(loadCache(cacheFile).files).toEqual({});
  });
});

describe("cachedScan", () => {
  it("parses every file on the first run and records them", () => {
    const f1 = path.join(dir, "a.jsonl");
    const f2 = path.join(dir, "b.jsonl");
    fs.writeFileSync(f1, "a");
    fs.writeFileSync(f2, "b");
    const parsed: string[] = [];
    const parseFile = (file: string): UsageEvent[] => {
      parsed.push(file);
      return [evt(path.basename(file))];
    };
    const cache = loadCache(cacheFile);
    const events = cachedScan([f1, f2], parseFile, cache);
    expect(events).toHaveLength(2);
    expect(parsed.sort()).toEqual([f1, f2].sort());
  });

  it("reuses cached events for unchanged files (parseFile not called)", () => {
    const f1 = path.join(dir, "a.jsonl");
    fs.writeFileSync(f1, "a");
    const cache = loadCache(cacheFile);
    cachedScan([f1], () => [evt("first")], cache);
    saveCache(cache, cacheFile);

    const reloaded = loadCache(cacheFile);
    let called = false;
    const events = cachedScan(
      [f1],
      () => {
        called = true;
        return [evt("second")];
      },
      reloaded,
    );
    expect(called).toBe(false);
    expect(events[0].model).toBe("first");
  });

  it("reparses a file whose size changed", () => {
    const f1 = path.join(dir, "a.jsonl");
    fs.writeFileSync(f1, "a");
    const cache = loadCache(cacheFile);
    cachedScan([f1], () => [evt("first")], cache);

    fs.writeFileSync(f1, "aa-grown");
    let called = false;
    const events = cachedScan(
      [f1],
      () => {
        called = true;
        return [evt("second")];
      },
      cache,
    );
    expect(called).toBe(true);
    expect(events[0].model).toBe("second");
  });

  it("does NOT prune within cachedScan (multiple adapters share one cache)", () => {
    const f1 = path.join(dir, "a.jsonl");
    const f2 = path.join(dir, "b.jsonl");
    fs.writeFileSync(f1, "a");
    fs.writeFileSync(f2, "b");
    const cache = loadCache(cacheFile);
    // Two adapters, each scanning only its own file, must not evict the other.
    cachedScan([f1], () => [evt("a")], cache);
    cachedScan([f2], () => [evt("b")], cache);
    expect(Object.keys(cache.files)).toContain(f1);
    expect(Object.keys(cache.files)).toContain(f2);
  });
});

describe("pruneCache", () => {
  it("drops entries whose source file is not in the live set", () => {
    const cache = loadCache(cacheFile);
    cache.files["/gone.jsonl"] = { mtimeMs: 1, size: 1, events: [evt("x")] };
    cache.files["/keep.jsonl"] = { mtimeMs: 1, size: 1, events: [evt("y")] };
    pruneCache(cache, ["/keep.jsonl"]);
    expect(Object.keys(cache.files)).toEqual(["/keep.jsonl"]);
  });
});
