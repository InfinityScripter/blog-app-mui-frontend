#!/usr/bin/env node
/**
 * Merge per-section RU message fragments into messages/ru.json.
 *
 * Section-extraction agents each write their namespace to
 * messages/_fragments/<ns>.json (RU source values only). This script deep-merges
 * every fragment into ru.json so hand-authored keys (e.g. `home.meta`, added by
 * the page layer) and agent-authored keys (e.g. `home.hero`) coexist under the
 * same namespace. Idempotent: re-running with the same fragments is a no-op.
 *
 * Usage: node scripts/i18n-merge-fragments.mjs
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const MESSAGES_DIR = path.join(ROOT, "messages");
const FRAGMENTS_DIR = path.join(MESSAGES_DIR, "_fragments");
const RU_PATH = path.join(MESSAGES_DIR, "ru.json");

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Deep-merge source into target. Objects merge recursively; scalars from source
// overwrite target only when target lacks the key (existing hand-authored values
// win, so re-running never clobbers curated copy). Returns the number of leaf
// keys newly added.
function deepMerge(target, source) {
  let added = 0;
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    if (isPlainObject(sourceValue)) {
      if (!isPlainObject(target[key])) {
        target[key] = {};
      }
      added += deepMerge(target[key], sourceValue);
    } else if (!(key in target)) {
      target[key] = sourceValue;
      added += 1;
    }
  });
  return added;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function main() {
  if (!fs.existsSync(FRAGMENTS_DIR)) {
    console.log("No _fragments directory — nothing to merge.");
    return;
  }

  const base = readJson(RU_PATH);
  const fragmentFiles = fs
    .readdirSync(FRAGMENTS_DIR)
    .filter((name) => name.endsWith(".json"))
    .sort();

  if (fragmentFiles.length === 0) {
    console.log("No fragments found.");
    return;
  }

  let totalAdded = 0;
  fragmentFiles.forEach((name) => {
    const fragment = readJson(path.join(FRAGMENTS_DIR, name));
    const added = deepMerge(base, fragment);
    totalAdded += added;
    console.log(`  merged ${name}: +${added} keys`);
  });

  fs.writeFileSync(RU_PATH, `${JSON.stringify(base, null, 2)}\n`, "utf8");
  console.log(
    `Merged ${fragmentFiles.length} fragments, +${totalAdded} keys → messages/ru.json`,
  );
}

main();
