import type { Cache } from "src/server/llm-stats/cache";
import type { UsageEvent } from "src/server/llm-stats/types";

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { costFor } from "src/server/llm-stats/pricing";
import { cachedScan } from "src/server/llm-stats/cache";
import {
  dateParts,
  projectOf,
  providerOf,
  modelFamily,
} from "src/server/llm-stats/normalize";

export const CODEX_ROOT = path.join(os.homedir(), ".codex", "sessions");

interface CodexLine {
  timestamp?: string;
  type?: string;
  payload?: {
    type?: string;
    model?: string;
    cwd?: string;
    info?: {
      total_token_usage?: {
        input_tokens?: number;
        cached_input_tokens?: number;
        output_tokens?: number;
        reasoning_output_tokens?: number;
      };
    };
  };
}

interface Cumulative {
  input: number;
  cached: number;
  output: number;
  reasoning: number;
}

interface FileState {
  model: string;
  cwd: string | null;
  prev: Cumulative;
  events: UsageEvent[];
}

function findRolloutFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root).flatMap((name) => {
    const full = path.join(root, name);
    return fs.statSync(full).isDirectory()
      ? findRolloutFiles(full)
      : name.endsWith(".jsonl")
        ? [full]
        : [];
  });
}

function parseLine(line: string): CodexLine | null {
  if (!line.trim()) return null;
  try {
    return JSON.parse(line) as CodexLine;
  } catch {
    return null;
  }
}

function tokenEvent(o: CodexLine, state: FileState): UsageEvent | null {
  const t = o.payload?.info?.total_token_usage;
  if (!t) return null;
  const cum: Cumulative = {
    input: t.input_tokens ?? 0,
    cached: t.cached_input_tokens ?? 0,
    output: t.output_tokens ?? 0,
    reasoning: t.reasoning_output_tokens ?? 0,
  };
  const delta = {
    input: Math.max(0, cum.input - state.prev.input),
    cached: Math.max(0, cum.cached - state.prev.cached),
    output: Math.max(0, cum.output - state.prev.output),
    reasoning: Math.max(0, cum.reasoning - state.prev.reasoning),
  };
  state.prev = cum;
  if (delta.input === 0 && delta.output === 0 && delta.cached === 0)
    return null;
  const ts = o.timestamp ?? new Date(0).toISOString();
  const dp = dateParts(ts);
  const base: UsageEvent = {
    harness: "codex",
    provider: providerOf(state.model),
    model: state.model,
    modelFamily: modelFamily(state.model),
    ts,
    dateKey: dp.dateKey,
    weekday: dp.weekday,
    hour: dp.hour,
    project: projectOf(state.cwd),
    tokensIn: delta.input,
    tokensOut: delta.output,
    cacheRead: delta.cached,
    cacheWrite: 0,
    reasoning: delta.reasoning,
    costUsd: null,
    sessionId: null,
    gitBranch: null,
    skill: null,
    mcpTool: null,
    agent: null,
    messageId: null,
  };
  return { ...base, costUsd: costFor(base) };
}

function scanFile(file: string): UsageEvent[] {
  const init: FileState = {
    model: "unknown",
    cwd: null,
    prev: { input: 0, cached: 0, output: 0, reasoning: 0 },
    events: [],
  };
  const final = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map(parseLine)
    .filter((o): o is CodexLine => o !== null)
    .reduce<FileState>((state, o) => {
      if (o.type === "session_meta" && o.payload?.cwd)
        state.cwd = o.payload.cwd;
      if (o.type === "turn_context") {
        if (o.payload?.model) state.model = o.payload.model;
        if (o.payload?.cwd) state.cwd = o.payload.cwd;
      }
      if (o.type === "event_msg" && o.payload?.type === "token_count") {
        const e = tokenEvent(o, state);
        if (e) state.events.push(e);
      }
      return state;
    }, init);
  return final.events;
}

export function scanCodex(root: string, cache?: Cache): UsageEvent[] {
  const files = findRolloutFiles(root);
  return cache ? cachedScan(files, scanFile, cache) : files.flatMap(scanFile);
}
