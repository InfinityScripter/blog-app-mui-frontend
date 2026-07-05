import { useMemo, useCallback } from "react";
import { useRouter } from "src/routes/hooks/use-router";
import { usePathname } from "src/routes/hooks/use-pathname";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = parseTab(searchParams.get("tab"));

  const setTab = useCallback(
    (next: LibraryTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === DEFAULT_TAB) params.delete("tab");
      else params.set("tab", next);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [router, pathname, searchParams],
  );

  return useMemo(() => ({ tab, setTab }), [tab, setTab]);
}
