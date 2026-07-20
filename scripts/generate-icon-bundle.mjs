/**
 * Собирает офлайн-бандл иконок для компонента Iconify.
 *
 * Сканирует src на литералы вида "prefix:icon-name" (только известные
 * Iconify-наборы), забирает использованные глифы одним запросом на набор с
 * api.iconify.design и пишет их в src/components/iconify/icon-bundle.json.
 * Компонент регистрирует бандл через addCollection — в рантайме сеть не нужна.
 *
 * Падает с ненулевым кодом, если какого-то имени нет в наборе (раньше такое
 * имя молча рендерилось пустым span — невидимая иконка, кейс logos:vk).
 *
 * Запуск: npm run icons:build (или node scripts/generate-icon-bundle.mjs)
 */
import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const KNOWN_PREFIXES = [
  "akar-icons",
  "eva",
  "ic",
  "logos",
  "mdi",
  "mingcute",
  "solar",
  "svg-spinners",
];

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC_DIR = path.join(ROOT, "src");
const OUT_FILE = path.join(ROOT, "src/components/iconify/icon-bundle.json");
const API_BASE = "https://api.iconify.design";

const ICON_LITERAL = /["'`]([a-z0-9-]+):([a-z0-9][a-z0-9-]*)["'`]/g;

async function listSourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return listSourceFiles(full);
      return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
    }),
  );
  return nested.flat();
}

/** @returns {Promise<Map<string, Set<string>>>} prefix -> icon names */
export async function scanUsedIconNames(srcDir = SRC_DIR) {
  const files = await listSourceFiles(srcDir);
  const byPrefix = new Map();
  const contents = await Promise.all(
    files.map((file) => readFile(file, "utf8")),
  );
  contents.forEach((text) => {
    Array.from(text.matchAll(ICON_LITERAL)).forEach(([, prefix, name]) => {
      if (!KNOWN_PREFIXES.includes(prefix)) return;
      if (!byPrefix.has(prefix)) byPrefix.set(prefix, new Set());
      byPrefix.get(prefix).add(name);
    });
  });
  return byPrefix;
}

function collectionCovers(collection, name) {
  return (
    Boolean(collection.icons && collection.icons[name]) ||
    Boolean(collection.aliases && collection.aliases[name])
  );
}

async function fetchSubset(prefix, names) {
  const url = `${API_BASE}/${prefix}.json?icons=${names.join(",")}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Iconify API ${res.status} for ${prefix}`);
  }
  return res.json();
}

async function main() {
  const byPrefix = await scanUsedIconNames();
  const prefixes = Array.from(byPrefix.keys()).sort();
  const missing = [];
  const collectionsByPrefix = new Map();

  await Promise.all(
    prefixes.map(async (prefix) => {
      const names = Array.from(byPrefix.get(prefix)).sort();
      const collection = await fetchSubset(prefix, names);
      names.forEach((name) => {
        if (!collectionCovers(collection, name)) {
          missing.push(`${prefix}:${name}`);
        }
      });
      delete collection.not_found;
      collectionsByPrefix.set(prefix, collection);
    }),
  );

  if (missing.length > 0) {
    console.error(
      "Этих имён нет в Iconify — они рендерятся пустым span. Замените или заинлайньте:",
    );
    missing.sort().forEach((name) => console.error(`  - ${name}`));
    process.exit(1);
  }

  // Объект по префиксам, не массив: у JSON-массива TS выводит union элементов
  // с фантомными `?: undefined` ключами, который не присваивается IconifyJSON.
  const bundle = Object.fromEntries(
    prefixes.map((prefix) => [prefix, collectionsByPrefix.get(prefix)]),
  );
  await writeFile(OUT_FILE, `${JSON.stringify(bundle, null, 2)}\n`);
  const total = prefixes.reduce(
    (sum, prefix) => sum + byPrefix.get(prefix).size,
    0,
  );
  console.log(
    `icon-bundle.json: ${total} иконок из ${prefixes.length} наборов (${prefixes.join(", ")})`,
  );
}

const isDirectRun =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  await main();
}
