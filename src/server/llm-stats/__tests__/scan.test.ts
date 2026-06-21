import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadCache } from "src/server/llm-stats/cache";
import { runAdapters } from "src/server/llm-stats/scan";
import { it, expect, describe, afterEach, beforeEach } from "vitest";

const fx = path.join(__dirname, "fixtures");

describe("runAdapters", () => {
  it("merges events from all available adapters and reports availability", () => {
    const { events, harnessesAvailable, scannedFiles, warnings } = runAdapters({
      useCache: false,
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

describe("runAdapters with cache", () => {
  let cacheFile: string;
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "scan-"));
    cacheFile = path.join(dir, "index.json");
  });
  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  function run() {
    return runAdapters({
      cacheFile,
      claudeRoot: path.join(fx, "claude-code"),
      codexRoot: path.join(fx, "codex"),
      opencodeDb: "/no/such/opencode.db",
    });
  }

  it("writes a cache file and yields identical results on a second run", () => {
    const first = run();
    expect(fs.existsSync(cacheFile)).toBe(true);
    const cached = loadCache(cacheFile);
    expect(Object.keys(cached.files).length).toBeGreaterThan(0);

    const second = run();
    // Same event count and same totals → cache reuse is transparent.
    expect(second.events.length).toBe(first.events.length);
    const sum = (es: typeof first.events) =>
      es.reduce((n, e) => n + e.tokensIn + e.tokensOut, 0);
    expect(sum(second.events)).toBe(sum(first.events));
  });

  it("still dedups Claude Code messages through the cache", () => {
    // The CC fixture has a duplicated assistant line (same message); both the
    // uncached and cached path must collapse it to one event.
    const ccCount = (result: ReturnType<typeof run>) =>
      result.events.filter((e) => e.harness === "claude-code").length;
    const uncached = runAdapters({
      useCache: false,
      claudeRoot: path.join(fx, "claude-code"),
    });
    const cached = run();
    expect(ccCount(cached)).toBe(ccCount(uncached));
  });
});
