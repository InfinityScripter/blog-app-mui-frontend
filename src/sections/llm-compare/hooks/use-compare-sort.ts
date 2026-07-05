import { useMemo, useCallback } from "react";
import { useRouter } from "src/routes/hooks/use-router";
import { usePathname } from "src/routes/hooks/use-pathname";
import { useSearchParams } from "src/routes/hooks/use-search-params";

import { DEFAULT_SORT_KEY, DEFAULT_SORT_DIR } from "../const";

import type { SortKey, SortDir } from "../const";

// ----------------------------------------------------------------------

const SORT_KEYS: SortKey[] = [
  "release",
  "priceIn",
  "priceOut",
  "context",
  "mmlu",
  "gpqa",
  "sweBench",
  "aime",
];

/** Narrows an untrusted string to a SortKey, or null. */
function parseSortKey(raw: string | null): SortKey | null {
  return SORT_KEYS.find((key) => key === raw) ?? null;
}

interface UseCompareSortReturn {
  sortKey: SortKey;
  sortDir: SortDir;
  /** Click a column: same key toggles direction, new key sorts by its default. */
  toggleSort: (key: SortKey) => void;
}

/**
 * Sort state synced to the URL (`?sort=<key>&dir=<asc|desc>`) so a sorted view
 * is shareable. An unknown/absent key falls back to the default (release desc);
 * clicking a fresh column starts from that column's natural direction (desc for
 * higher-is-better metrics, asc for price where cheaper leads).
 */
export function useCompareSort(): UseCompareSortReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortKey = parseSortKey(searchParams.get("sort")) ?? DEFAULT_SORT_KEY;
  const rawDir = searchParams.get("dir");
  const sortDir: SortDir =
    rawDir === "asc" || rawDir === "desc" ? rawDir : DEFAULT_SORT_DIR;

  const toggleSort = useCallback(
    (key: SortKey) => {
      const params = new URLSearchParams(searchParams.toString());
      const nextDir: SortDir =
        key === sortKey ? (sortDir === "asc" ? "desc" : "asc") : "desc";
      params.set("sort", key);
      params.set("dir", nextDir);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, sortKey, sortDir],
  );

  return useMemo(
    () => ({ sortKey, sortDir, toggleSort }),
    [sortKey, sortDir, toggleSort],
  );
}
