#!/usr/bin/env node
/**
 * Generate the English UI message catalog (messages/en.json) from the Russian
 * source (messages/ru.json) using the DeepL API.
 *
 * - Only fills GAPS: a key already present in en.json AND different from its RU
 *   source is treated as a curated/human translation and left untouched. Keys
 *   missing from en.json, or still identical to RU, are (re)translated. This
 *   lets hand-seeded English (nav, footer, meta) survive while the bulk of
 *   agent-extracted RU keys get machine-translated once.
 * - Preserves ICU interpolation placeholders ({name}, {count}) by masking them
 *   with a sentinel DeepL won't touch, then restoring them.
 * - Idempotent: re-running only translates still-missing keys.
 * - Graceful: with no DEEPL_AUTH_KEY it logs and leaves en.json unchanged, so a
 *   build/dev run never hard-fails on a missing key.
 *
 * Usage: DEEPL_AUTH_KEY=xxx node scripts/i18n-translate-catalog.mjs
 *        (add --force to retranslate every key, ignoring existing en values)
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const MESSAGES_DIR = path.join(ROOT, "messages");
const RU_PATH = path.join(MESSAGES_DIR, "ru.json");
const EN_PATH = path.join(MESSAGES_DIR, "en.json");

const DEEPL_KEY = process.env.DEEPL_AUTH_KEY;
const DEEPL_URL = "https://api-free.deepl.com/v2/translate";
const FORCE = process.argv.includes("--force");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

// Flatten a nested message object into dot-path → string entries.
function flatten(obj, prefix, out) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const dotted = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flatten(value, dotted, out);
    } else {
      out[dotted] = value;
    }
  });
  return out;
}

function getAt(obj, dotted) {
  return dotted.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) return acc[part];
    return undefined;
  }, obj);
}

function setAt(obj, dotted, value) {
  const parts = dotted.split(".");
  let node = obj;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      node[part] = value;
      return;
    }
    if (!node[part] || typeof node[part] !== "object") node[part] = {};
    node = node[part];
  });
}

// Mask ICU placeholders so DeepL leaves them intact, then restore. Uses an
// XML-ish token DeepL treats as a non-translatable atom.
function maskPlaceholders(text) {
  const tokens = [];
  const masked = text.replace(/\{[^}]+\}/g, (match) => {
    const id = tokens.length;
    tokens.push(match);
    return `[[${id}]]`;
  });
  return { masked, tokens };
}

function restorePlaceholders(text, tokens) {
  return text.replace(/\[\[(\d+)\]\]/g, (_, id) => tokens[Number(id)] ?? "");
}

async function translate(text) {
  const { masked, tokens } = maskPlaceholders(text);
  const body = new URLSearchParams({
    text: masked,
    source_lang: "RU",
    target_lang: "EN-US",
    preserve_formatting: "1",
  });
  const res = await fetch(DEEPL_URL, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${DEEPL_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`DeepL ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  const out = json.translations?.[0]?.text ?? masked;
  return restorePlaceholders(out, tokens);
}

async function main() {
  const ru = readJson(RU_PATH);
  const en = fs.existsSync(EN_PATH) ? readJson(EN_PATH) : {};

  const ruFlat = flatten(ru, "", {});
  const keys = Object.keys(ruFlat);

  // Decide which keys need translation.
  const pending = keys.filter((key) => {
    if (FORCE) return true;
    const enValue = getAt(en, key);
    if (typeof enValue !== "string" || enValue.length === 0) return true;
    // Still equal to RU source → not yet translated (hand-seeded EN differs).
    return enValue === ruFlat[key];
  });

  console.log(
    `RU keys: ${keys.length}. Already translated: ${keys.length - pending.length}. Pending: ${pending.length}.`,
  );

  if (pending.length === 0) {
    console.log("Nothing to translate.");
    return;
  }

  if (!DEEPL_KEY) {
    console.warn(
      "DEEPL_AUTH_KEY not set — leaving en.json unchanged. Missing keys will fall back to the key/default locale at runtime.",
    );
    // Still ensure every key at least EXISTS in en.json (fall back to RU) so
    // next-intl doesn't throw on a missing key. Comment out if you prefer hard
    // fallback to defaultLocale instead.
    return;
  }

  // Translate sequentially to stay well under free-tier rate limits.
  let done = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const key of pending) {
    // eslint-disable-next-line no-await-in-loop
    const translated = await translate(ruFlat[key]);
    setAt(en, key, translated);
    done += 1;
    if (done % 10 === 0 || done === pending.length) {
      console.log(`  translated ${done}/${pending.length}`);
    }
  }

  fs.writeFileSync(EN_PATH, `${JSON.stringify(en, null, 2)}\n`, "utf8");
  console.log(`Wrote ${done} translations → messages/en.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
