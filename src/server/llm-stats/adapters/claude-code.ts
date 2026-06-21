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

export const CLAUDE_ROOT = path.join(os.homedir(), ".claude", "projects");

interface CcLine {
  type?: string;
  timestamp?: string;
  cwd?: string;
  sessionId?: string;
  gitBranch?: string;
  attributionSkill?: string;
  attributionMcpTool?: string;
  attributionAgent?: string;
  message?: {
    id?: string;
    model?: string;
    usage?: {
      input_tokens?: number;
      output_tokens?: number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
    };
  };
}

function findJsonlFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root).flatMap((name) => {
    const full = path.join(root, name);
    return fs.statSync(full).isDirectory()
      ? findJsonlFiles(full)
      : name.endsWith(".jsonl")
        ? [full]
        : [];
  });
}

function parseLine(line: string): CcLine | null {
  if (!line.trim()) return null;
  try {
    return JSON.parse(line) as CcLine;
  } catch {
    return null;
  }
}

function isUsageLine(o: CcLine | null): o is CcLine {
  return Boolean(
    o && o.type === "assistant" && o.message?.usage && o.message.model,
  );
}

function toEvent(o: CcLine): UsageEvent {
  const model = o.message?.model ?? "unknown";
  const u = o.message?.usage ?? {};
  const ts = o.timestamp ?? new Date(0).toISOString();
  const dp = dateParts(ts);
  const base: UsageEvent = {
    harness: "claude-code",
    provider: providerOf(model),
    model,
    modelFamily: modelFamily(model),
    ts,
    dateKey: dp.dateKey,
    weekday: dp.weekday,
    hour: dp.hour,
    project: projectOf(o.cwd ?? null),
    tokensIn: u.input_tokens ?? 0,
    tokensOut: u.output_tokens ?? 0,
    cacheRead: u.cache_read_input_tokens ?? 0,
    cacheWrite: u.cache_creation_input_tokens ?? 0,
    reasoning: 0,
    costUsd: null,
    sessionId: o.sessionId ?? null,
    gitBranch: o.gitBranch ?? null,
    skill: o.attributionSkill ?? null,
    mcpTool: o.attributionMcpTool ?? null,
    agent: o.attributionAgent ?? null,
    messageId: o.message?.id ?? null,
  };
  return { ...base, costUsd: costFor(base) };
}

function parseClaudeFile(file: string): UsageEvent[] {
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map(parseLine)
    .filter(isUsageLine)
    .map(toEvent);
}

// Dedup the same assistant message replayed across files (subagent transcripts
// replay the parent's messages). Key on message.id, which is carried on the
// event and survives the cache round-trip. Events without an id (rare) are kept.
function dedupEvents(events: UsageEvent[]): UsageEvent[] {
  const seen = new Set<string>();
  return events.filter((e) => {
    if (!e.messageId) return true;
    if (seen.has(e.messageId)) return false;
    seen.add(e.messageId);
    return true;
  });
}

export function scanClaudeCode(root: string, cache?: Cache): UsageEvent[] {
  const files = findJsonlFiles(root);
  const raw = cache
    ? cachedScan(files, parseClaudeFile, cache)
    : files.flatMap(parseClaudeFile);
  return dedupEvents(raw);
}
