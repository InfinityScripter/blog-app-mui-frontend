"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

// ----------------------------------------------------------------------

// Known sort option values → their `blog.sort.<key>` message. Maps a raw sort
// value (from state/props) to a localized label without a dynamic `t()` key or
// a type assertion. Unknown values fall back to the raw string.
const SORT_LABEL_KEYS = {
  latest: "sort.latest",
  popular: "sort.popular",
  oldest: "sort.oldest",
} as const;

function isSortKey(value: string): value is keyof typeof SORT_LABEL_KEYS {
  return value in SORT_LABEL_KEYS;
}

export function useSortOptionLabel(): (value: string) => string {
  const t = useTranslations("blog");

  return useCallback(
    (value: string) => (isSortKey(value) ? t(SORT_LABEL_KEYS[value]) : value),
    [t],
  );
}
