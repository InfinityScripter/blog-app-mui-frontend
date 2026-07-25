import { useMemo, useCallback } from "react";
import { useSearchParams } from "src/routes/hooks/use-search-params";

import { TABS, DEFAULT_TAB } from "../const";

import type { LibraryTab } from "../types";

// ----------------------------------------------------------------------

/** Narrows an untrusted string to a LibraryTab, or the default. */
function parseTab(raw: string | null): LibraryTab {
  const match = TABS.find((tab) => tab.value === raw);
  return match ? match.value : DEFAULT_TAB;
}

interface UseLibraryTabReturn {
  tab: LibraryTab;
  setTab: (tab: LibraryTab) => void;
}

/**
 * Active hub tab synced to the URL (`?tab=read|tools|til`) so a specific tab is
 * shareable / deep-linkable. An unknown or absent value falls back to the
 * default tab.
 */
export function useLibraryTab(): UseLibraryTabReturn {
  const searchParams = useSearchParams();

  const tab = parseTab(searchParams.get("tab"));

  const setTab = useCallback(
    (next: LibraryTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === DEFAULT_TAB) params.delete("tab");
      else params.set("tab", next);
      const query = params.toString();
      // Raw History API → needs the raw browser path. `usePathname` is the
      // next-intl one and strips the locale, so it rewrote /en/library to
      // /library and a reload bounced the reader to the default locale.
      const path = window.location.pathname;
      window.history.replaceState(null, "", query ? `${path}?${query}` : path);
    },
    [searchParams],
  );

  return useMemo(() => ({ tab, setTab }), [tab, setTab]);
}
