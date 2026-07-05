import { useMemo, useCallback } from "react";
import { useRouter } from "src/routes/hooks/use-router";
import { usePathname } from "src/routes/hooks/use-pathname";
import { useSearchParams } from "src/routes/hooks/use-search-params";

import { MAX_PINS } from "../const";
import { sanitizePins } from "../utils";

import type { ComparableModel } from "../types";

// ----------------------------------------------------------------------

interface UseComparePinsReturn {
  /** Sanitized, ordered, capped pinned ids (max {@link MAX_PINS}). */
  pinned: string[];
  /** True when the id is pinned. */
  isPinned: (id: string) => boolean;
  /** True when the pin limit is reached (further pins are ignored). */
  isFull: boolean;
  /** Adds/removes a model from the pin set (no-op add when full). */
  togglePin: (id: string) => void;
  /** Clears all pins. */
  clear: () => void;
}

/** Writes a pin list to the URL (`?pin=a,b,c`), dropping the param when empty. */
function writePins(
  ids: string[],
  searchParams: URLSearchParams,
  pathname: string,
  replace: (url: string) => void,
): void {
  const params = new URLSearchParams(searchParams.toString());
  if (ids.length) params.set("pin", ids.join(","));
  else params.delete("pin");
  const query = params.toString();
  replace(query ? `${pathname}?${query}` : pathname);
}

/**
 * Pinned-for-comparison ids synced to the URL so a head-to-head is shareable
 * (the LLM-citation / social hook). The raw `?pin=` value is sanitized against
 * the known model set on every read — unknown ids dropped, de-duped, capped —
 * so a hand-edited URL can never break the view.
 */
export function useComparePins(
  models: ComparableModel[],
): UseComparePinsReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pinned = useMemo(() => {
    const raw = searchParams.get("pin");
    const ids = raw ? raw.split(",").filter(Boolean) : [];
    return sanitizePins(ids, models);
  }, [searchParams, models]);

  const isPinned = useCallback((id: string) => pinned.includes(id), [pinned]);

  const togglePin = useCallback(
    (id: string) => {
      const next = pinned.includes(id)
        ? pinned.filter((item) => item !== id)
        : [...pinned, id].slice(0, MAX_PINS);
      writePins(next, searchParams, pathname, (url) => router.replace(url));
    },
    [pinned, searchParams, pathname, router],
  );

  const clear = useCallback(() => {
    writePins([], searchParams, pathname, (url) => router.replace(url));
  }, [searchParams, pathname, router]);

  return useMemo(
    () => ({
      pinned,
      isPinned,
      isFull: pinned.length >= MAX_PINS,
      togglePin,
      clear,
    }),
    [pinned, isPinned, togglePin, clear],
  );
}
