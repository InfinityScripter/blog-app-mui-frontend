import type { UsageEvent } from "src/server/llm-stats/types";

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const CACHE_FILE = path.join(
  os.homedir(),
  ".cache",
  "llm-stats",
  "index.json",
);

interface CacheEntry {
  mtimeMs: number;
  size: number;
  events: UsageEvent[];
}

export interface Cache {
  files: Record<string, CacheEntry>;
}

export function loadCache(file: string = CACHE_FILE): Cache {
  if (!fs.existsSync(file)) return { files: {} };
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
    if (parsed && typeof parsed === "object" && "files" in parsed) {
      const { files } = parsed as { files: unknown };
      if (files && typeof files === "object") {
        return { files: files as Record<string, CacheEntry> };
      }
    }
    return { files: {} };
  } catch {
    return { files: {} };
  }
}

export function saveCache(cache: Cache, file: string = CACHE_FILE): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // Write to a temp file then rename: rename is atomic on POSIX, so a crash or a
  // concurrent reader never sees a half-written (and thus corrupt) cache file.
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(cache));
  fs.renameSync(tmp, file);
}

// For each file: reuse cached events if mtime+size are unchanged, else reparse.
// Mutates `cache` in place, adding/refreshing entries. Does NOT prune — multiple
// adapters share one cache, so a per-call prune would wipe the others' entries.
// Use pruneCache() once, with the union of all live files, to drop stale ones.
export function cachedScan(
  files: string[],
  parseFile: (file: string) => UsageEvent[],
  cache: Cache,
): UsageEvent[] {
  return files.flatMap((file) => {
    const stat = fs.statSync(file);
    const hit = cache.files[file];
    if (hit && hit.mtimeMs === stat.mtimeMs && hit.size === stat.size) {
      return hit.events;
    }
    const events = parseFile(file);
    cache.files[file] = { mtimeMs: stat.mtimeMs, size: stat.size, events };
    return events;
  });
}

// Drop cache entries whose source files are no longer in `liveFiles`.
export function pruneCache(cache: Cache, liveFiles: string[]): void {
  const present = new Set(liveFiles);
  Object.keys(cache.files).forEach((known) => {
    if (!present.has(known)) delete cache.files[known];
  });
}
