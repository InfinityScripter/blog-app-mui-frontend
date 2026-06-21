import path from "node:path";
import { it, expect, describe } from "vitest";
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
