import type { UsageEvent } from "src/server/llm-stats/types";

import { it, expect, describe } from "vitest";
import { aggregate } from "src/server/llm-stats/aggregate";

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
    messageId: null,
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
    expect(b.byHarness.find((h) => h.harness === "codex")?.requests).toBe(1);
    expect(b.byModelFamily.some((f) => f.family === "haiku")).toBe(true);
    expect(b.byProject[0].project).toBe("demo");
    expect(b.trend).toHaveLength(2);
    expect(b.heatmap.find((c) => c.hour === 10)?.tokens).toBeGreaterThan(0);
  });
  it("builds claude extras when CC present", () => {
    expect(b.claudeExtras).not.toBeNull();
    expect(b.claudeExtras?.topSkills[0].name).toBe("brainstorm");
    expect(b.claudeExtras?.topMcpTools[0].name).toBe("figma");
    expect(b.claudeExtras?.cacheHitRatio).toBeGreaterThan(0);
  });
});
