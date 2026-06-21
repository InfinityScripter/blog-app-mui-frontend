import path from "node:path";
import { it, expect, describe } from "vitest";
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
