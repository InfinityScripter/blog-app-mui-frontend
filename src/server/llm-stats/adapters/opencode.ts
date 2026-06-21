import type { UsageEvent } from "src/server/llm-stats/types";

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import { costFor } from "src/server/llm-stats/pricing";
import {
  dateParts,
  projectOf,
  providerOf,
  modelFamily,
} from "src/server/llm-stats/normalize";

export const OPENCODE_DB = path.join(
  os.homedir(),
  ".local",
  "share",
  "opencode",
  "opencode.db",
);

interface OcMessage {
  role?: string;
  modelID?: string;
  providerID?: string;
  model?: { providerID?: string; modelID?: string };
  time?: { created?: number };
  tokens?: {
    input?: number;
    output?: number;
    reasoning?: number;
    cache?: { read?: number; write?: number };
  };
  path?: { cwd?: string };
}

function parseMessage(data: string): OcMessage | null {
  try {
    return JSON.parse(data) as OcMessage;
  } catch {
    return null;
  }
}

function toEvent(m: OcMessage): UsageEvent {
  const model = m.modelID ?? m.model?.modelID ?? "unknown";
  const created = m.time?.created ?? 0;
  const ts = new Date(created).toISOString();
  const dp = dateParts(ts);
  const tok = m.tokens ?? {};
  const base: UsageEvent = {
    harness: "opencode",
    provider: providerOf(model),
    model,
    modelFamily: modelFamily(model),
    ts,
    dateKey: dp.dateKey,
    weekday: dp.weekday,
    hour: dp.hour,
    project: projectOf(m.path?.cwd ?? null),
    tokensIn: tok.input ?? 0,
    tokensOut: tok.output ?? 0,
    cacheRead: tok.cache?.read ?? 0,
    cacheWrite: tok.cache?.write ?? 0,
    reasoning: tok.reasoning ?? 0,
    costUsd: null,
    sessionId: null,
    gitBranch: null,
    skill: null,
    mcpTool: null,
    agent: null,
  };
  return { ...base, costUsd: costFor(base) };
}

export function scanOpenCode(dbPath: string = OPENCODE_DB): UsageEvent[] {
  if (!fs.existsSync(dbPath)) return [];
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare("SELECT data FROM message").all() as {
      data: string;
    }[];
    return rows
      .map((r) => parseMessage(r.data))
      .filter((m): m is OcMessage => m !== null && m.role === "assistant")
      .map(toEvent);
  } finally {
    db.close();
  }
}
