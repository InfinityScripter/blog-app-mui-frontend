import type { StatsBundle } from "src/server/llm-stats/types";

import { it, expect, describe } from "vitest";
import { sanitizeBundle } from "src/server/llm-stats/sanitize";

function bundle(): StatsBundle {
  return {
    kpis: {
      totalTokens: 100,
      totalCostUsd: 1,
      sessions: 1,
      activeDays: 1,
      topModelFamily: "opus",
      topHarness: "claude-code",
    },
    byModelFamily: [{ family: "opus", tokens: 100, requests: 1, costUsd: 1 }],
    byModel: [],
    byHarness: [
      { harness: "claude-code", tokens: 100, requests: 1, costUsd: 1 },
    ],
    byProject: [
      { project: "secret-work-repo", tokens: 50, requests: 1 },
      { project: "blog-app", tokens: 50, requests: 1 },
    ],
    trend: [{ dateKey: "2026-06-21", tokens: 100, costUsd: 1, byHarness: {} }],
    heatmap: [{ weekday: 0, hour: 10, tokens: 100 }],
    claudeExtras: {
      topSkills: [],
      topMcpTools: [],
      cacheHitRatio: 0.5,
      agentEvents: 0,
    },
    meta: {
      generatedAt: "2026-06-21T00:00:00.000Z",
      scannedFiles: 1,
      harnessesAvailable: ["claude-code"],
      warnings: [],
    },
  };
}

describe("sanitizeBundle", () => {
  it("empties byProject (project names must not leave the machine)", () => {
    const out = sanitizeBundle(bundle());
    expect(out.byProject).toEqual([]);
  });

  it("keeps every other field intact", () => {
    const out = sanitizeBundle(bundle());
    expect(out.kpis.totalTokens).toBe(100);
    expect(out.byModelFamily).toHaveLength(1);
    expect(out.byHarness[0].harness).toBe("claude-code");
    expect(out.trend).toHaveLength(1);
    expect(out.heatmap).toHaveLength(1);
    expect(out.claudeExtras?.cacheHitRatio).toBe(0.5);
    expect(out.meta.generatedAt).toBe("2026-06-21T00:00:00.000Z");
  });

  it("does not mutate the input", () => {
    const input = bundle();
    sanitizeBundle(input);
    expect(input.byProject).toHaveLength(2);
  });
});
