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
import {
  loadCache,
  saveCache,
  pruneCache,
  CACHE_FILE,
} from "src/server/llm-stats/cache";

interface ScanRoots {
  claudeRoot?: string;
  codexRoot?: string;
  opencodeDb?: string;
  cacheFile?: string;
  useCache?: boolean;
}

interface ScanResult {
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

  const claudeAvailable = fs.existsSync(claudeRoot);
  const codexAvailable = fs.existsSync(codexRoot);
  const opencodeAvailable = fs.existsSync(opencodeDb);
  const anyAvailable = claudeAvailable || codexAvailable || opencodeAvailable;

  // Incremental cache: unchanged files reuse parsed events. Only enabled when at
  // least one harness has data — on a serverless host (e.g. Vercel) no data dir
  // exists AND the filesystem is read-only, so loading/writing the cache would
  // throw; skipping it there keeps the route returning a clean empty bundle.
  // loadCache itself is failure-safe; saveCache is guarded below.
  const cacheFile = roots.cacheFile ?? CACHE_FILE;
  const useCache = roots.useCache !== false && anyAvailable;
  const cache = useCache ? loadCache(cacheFile) : undefined;

  const results: AdapterResult[] = [
    runOne(
      claudeAvailable,
      "claude-code",
      () => scanClaudeCode(claudeRoot, cache),
      () => countFiles(claudeRoot, ".jsonl"),
    ),
    runOne(
      codexAvailable,
      "codex",
      () => scanCodex(codexRoot, cache),
      () => countFiles(codexRoot, ".jsonl"),
    ),
    runOne(
      opencodeAvailable,
      "opencode",
      () => scanOpenCode(opencodeDb, cache),
      () => 1,
    ),
  ];

  const cacheWarnings: string[] = [];
  if (cache) {
    // Prune vanished source files, then persist. Wrapped so a read-only or full
    // filesystem degrades to a warning instead of crashing the whole scan.
    try {
      const live = [
        ...listJsonl(claudeRoot),
        ...listJsonl(codexRoot),
        ...(opencodeAvailable ? [opencodeDb] : []),
      ];
      pruneCache(cache, live);
      saveCache(cache, cacheFile);
    } catch (err) {
      cacheWarnings.push(`cache: ${(err as Error).message}`);
    }
  }

  return {
    events: results.flatMap((r) => r.events),
    harnessesAvailable: results
      .map((r) => r.harness)
      .filter((h): h is HarnessId => h !== null),
    scannedFiles: results.reduce((n, r) => n + r.files, 0),
    warnings: [
      ...results.map((r) => r.warning).filter((w): w is string => w !== null),
      ...cacheWarnings,
    ],
  };
}
