import { it, expect, describe } from "vitest";

import iconBundle from "../icon-bundle.json";
// Сканер общий с кодогеном, чтобы тест и генерация не разошлись.
import { scanUsedIconNames } from "../../../../scripts/generate-icon-bundle.mjs";

// ----------------------------------------------------------------------

interface BundledCollection {
  prefix: string;
  icons: Record<string, unknown>;
  aliases?: Record<string, unknown>;
}

const collections: BundledCollection[] = Object.values(iconBundle);

function isBundled(prefix: string, name: string): boolean {
  const collection = collections.find((entry) => entry.prefix === prefix);
  if (!collection) return false;
  return name in collection.icons || name in (collection.aliases ?? {});
}

describe("icon-bundle", () => {
  it("содержит каждое Iconify-имя, используемое в src (иначе npm run icons:build)", async () => {
    const byPrefix = await scanUsedIconNames();
    const missing = Array.from(byPrefix.entries()).flatMap(
      ([prefix, names]: [string, Set<string>]) =>
        Array.from(names)
          .filter((name) => !isBundled(prefix, name))
          .map((name) => `${prefix}:${name}`),
    );
    expect(missing).toEqual([]);
  });

  it("не пустой и сгруппирован по префиксам без дублей", () => {
    expect(collections.length).toBeGreaterThan(0);
    const prefixes = collections.map((collection) => collection.prefix);
    expect(new Set(prefixes).size).toBe(prefixes.length);
  });
});
