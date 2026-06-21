import type { UsageEvent } from "src/server/llm-stats/types";

import { it, expect, describe } from "vitest";
import { costFor } from "src/server/llm-stats/pricing";

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
    // opus priced 15 in / 75 out per 1M
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
