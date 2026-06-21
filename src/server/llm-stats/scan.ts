import type { HarnessId, UsageEvent } from "src/server/llm-stats/types";

import fs from "node:fs";
import path from "node:path";
import { scanCodex, CODEX_ROOT } from "src/server/llm-stats/adapters/codex";
import {
  OPENCODE_DB,
  scanOpenCode,
} from "src/server/llm-stats/adapters/opencode";
import {
  loadCache,
  saveCache,
  pruneCache,
  CACHE_FILE,
} from "src/server/llm-stats/cache";
import {
  CLAUDE_ROOT,
  scanClaudeCode,
} from "src/server/llm-stats/adapters/claude-code";

export interface ScanRoots {
  claudeRoot?: string;
  codexRoot?: string;
  opencodeDb?: string;
  cacheFile?: string;
  useCache?: boolean;
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

function listJsonl(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root).flatMap((name) => {
    const full = path.join(root, name);
    if (fs.statSync(full).isDirectory()) return listJsonl(full);
    return name.endsWith(".jsonl") ? [full] : [];
  });
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

  // One shared incremental cache: unchanged files reuse parsed events, only
  // new/modified files are reparsed. On by default (the route relies on it);
  // tests pass roots.useCache === false to scan fixtures without touching disk.
  const cacheFile = roots.cacheFile ?? CACHE_FILE;
  const useCache = roots.useCache !== false;
  const cache = useCache ? loadCache(cacheFile) : undefined;

  const results: AdapterResult[] = [
    runOne(
      fs.existsSync(claudeRoot),
      "claude-code",
      () => scanClaudeCode(claudeRoot, cache),
      () => countFiles(claudeRoot, ".jsonl"),
    ),
    runOne(
      fs.existsSync(codexRoot),
      "codex",
      () => scanCodex(codexRoot, cache),
      () => countFiles(codexRoot, ".jsonl"),
    ),
    runOne(
      fs.existsSync(opencodeDb),
      "opencode",
      () => scanOpenCode(opencodeDb, cache),
      () => 1,
    ),
  ];

  if (cache) {
    // Prune entries for source files that vanished since the last scan, then
    // persist. Prune uses the union of all adapters' live files so no adapter's
    // entries get evicted by another's scan.
    const live = [
      ...listJsonl(claudeRoot),
      ...listJsonl(codexRoot),
      ...(fs.existsSync(opencodeDb) ? [opencodeDb] : []),
    ];
    pruneCache(cache, live);
    saveCache(cache, cacheFile);
  }

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
