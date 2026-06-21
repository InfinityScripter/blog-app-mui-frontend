import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import { it, expect, afterAll, describe, beforeAll } from "vitest";
import { scanOpenCode } from "src/server/llm-stats/adapters/opencode";

let dbPath: string;

beforeAll(() => {
  dbPath = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), "oc-")),
    "opencode.db",
  );
  const db = new Database(dbPath);
  db.exec("CREATE TABLE message (id TEXT, data TEXT)");
  const row = {
    role: "assistant",
    modelID: "gpt-4o",
    providerID: "openai",
    time: { created: 1782000000000, completed: 1782000001000 },
    tokens: {
      input: 80,
      output: 14,
      reasoning: 0,
      cache: { read: 5, write: 3 },
    },
    path: {
      cwd: "/Users/x/projects/oc-demo",
      root: "/Users/x/projects/oc-demo",
    },
  };
  db.prepare("INSERT INTO message (id, data) VALUES (?, ?)").run(
    "m1",
    JSON.stringify(row),
  );
  db.prepare("INSERT INTO message (id, data) VALUES (?, ?)").run(
    "u1",
    JSON.stringify({ role: "user" }),
  );
  db.close();
});

afterAll(() =>
  fs.rmSync(path.dirname(dbPath), { recursive: true, force: true }),
);

describe("scanOpenCode", () => {
  it("reads assistant messages from the sqlite db", () => {
    const events = scanOpenCode(dbPath);
    expect(events).toHaveLength(1);
    const e = events[0];
    expect(e.harness).toBe("opencode");
    expect(e.model).toBe("gpt-4o");
    expect(e.tokensIn).toBe(80);
    expect(e.cacheRead).toBe(5);
    expect(e.cacheWrite).toBe(3);
    expect(e.project).toBe("oc-demo");
  });
  it("returns [] when the db path does not exist", () => {
    expect(scanOpenCode("/no/such/opencode.db")).toEqual([]);
  });
});
