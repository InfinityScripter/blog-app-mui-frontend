import type { UsageEvent, PriceTable } from "src/server/llm-stats/types";

// Best-effort public list prices, USD per 1M tokens, keyed by modelFamily.
// Editable; clearly an estimate, not billing.
export const PRICE_TABLE: PriceTable = {
  opus: { in: 15, out: 75, cacheRead: 1.5, cacheWrite: 18.75 },
  sonnet: { in: 3, out: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  haiku: { in: 0.8, out: 4, cacheRead: 0.08, cacheWrite: 1 },
  "gpt-4o": { in: 2.5, out: 10, cacheRead: 1.25, cacheWrite: 0 },
  "gpt-5": { in: 1.25, out: 10, cacheRead: 0.125, cacheWrite: 0 },
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
