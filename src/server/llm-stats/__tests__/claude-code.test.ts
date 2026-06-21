import path from "node:path";
import { it, expect, describe } from "vitest";
import { scanClaudeCode } from "src/server/llm-stats/adapters/claude-code";

const root = path.join(__dirname, "fixtures", "claude-code");

describe("scanClaudeCode", () => {
  const events = scanClaudeCode(root);

  it("emits one event per unique assistant message (dedup by message.id)", () => {
    expect(events).toHaveLength(2); // msg_A once + msg_B, user line ignored
  });
  it("maps usage fields and metadata", () => {
    const a = events.find((e) => e.model === "claude-opus-4-8");
    expect(a).toBeDefined();
    expect(a?.harness).toBe("claude-code");
    expect(a?.provider).toBe("anthropic");
    expect(a?.modelFamily).toBe("opus");
    expect(a?.tokensIn).toBe(100);
    expect(a?.tokensOut).toBe(20);
    expect(a?.cacheWrite).toBe(40); // cache_creation -> cacheWrite
    expect(a?.cacheRead).toBe(200); // cache_read -> cacheRead
    expect(a?.project).toBe("demo");
    expect(a?.gitBranch).toBe("main");
  });
  it("captures skill + mcpTool attribution", () => {
    const b = events.find((e) => e.model.includes("haiku"));
    expect(b?.skill).toBe("superpowers:brainstorming");
    expect(b?.mcpTool).toBe("figma__get_metadata");
  });
});
