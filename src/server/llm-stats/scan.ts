import type { HarnessId, UsageEvent } from "src/server/llm-stats/types";

import fs from "node:fs";
import path from "node:path";
import { scanCodex, CODEX_ROOT } from "src/server/llm-stats/adapters/codex";
import {
  OPENCODE_DB,
  scanOpenCode,
} from "src/server/llm-stats/adapters/opencode";
import {
  CLAUDE_ROOT,
  scanClaudeCode,
} from "src/server/llm-stats/adapters/claude-code";

export interface ScanRoots {
  claudeRoot?: string;
  codexRoot?: string;
  opencodeDb?: string;
}

export interface ScanResult {
  events: UsageEvent[];
  harnessesAvailable: HarnessId[];
  scannedFiles: number;
  warnings: string[];
}

function countFiles(root: string, ext: string): number {
  if (!fs.existsSync(root)) return 0;
  return fs.readdirSync(root).reduce((n, name) => {
    const full = path.join(root, name);
    if (fs.statSync(full).isDirectory()) return n + countFiles(full, ext);
    return name.endsWith(ext) ? n + 1 : n;
  }, 0);
}

interface AdapterResult {
  events: UsageEvent[];
  harness: HarnessId | null;
  files: number;
  warning: string | null;
}

function runOne(
  available: boolean,
  harness: HarnessId,
  scan: () => UsageEvent[],
  files: () => number,
): AdapterResult {
  if (!available) return { events: [], harness: null, files: 0, warning: null };
  try {
    return { events: scan(), harness, files: files(), warning: null };
  } catch (err) {
    return {
      events: [],
      harness: null,
      files: 0,
      warning: `${harness}: ${(err as Error).message}`,
    };
  }
}

export function runAdapters(roots: ScanRoots = {}): ScanResult {
  const claudeRoot = roots.claudeRoot ?? CLAUDE_ROOT;
  const codexRoot = roots.codexRoot ?? CODEX_ROOT;
  const opencodeDb = roots.opencodeDb ?? OPENCODE_DB;

  const results: AdapterResult[] = [
    runOne(
      fs.existsSync(claudeRoot),
      "claude-code",
      () => scanClaudeCode(claudeRoot),
      () => countFiles(claudeRoot, ".jsonl"),
    ),
    runOne(
      fs.existsSync(codexRoot),
      "codex",
      () => scanCodex(codexRoot),
      () => countFiles(codexRoot, ".jsonl"),
    ),
    runOne(
      fs.existsSync(opencodeDb),
      "opencode",
      () => scanOpenCode(opencodeDb),
      () => 1,
    ),
  ];

  return {
    events: results.flatMap((r) => r.events),
    harnessesAvailable: results
      .map((r) => r.harness)
      .filter((h): h is HarnessId => h !== null),
    scannedFiles: results.reduce((n, r) => n + r.files, 0),
    warnings: results
      .map((r) => r.warning)
      .filter((w): w is string => w !== null),
  };
}
