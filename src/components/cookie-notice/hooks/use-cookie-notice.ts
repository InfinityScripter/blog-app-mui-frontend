import { useState, useEffect, useCallback } from "react";

import { COOKIE_NOTICE_STORAGE_KEY } from "../const";

// ----------------------------------------------------------------------

// Shows the notice until the visitor dismisses it. The dismissal flag lives in
// localStorage; reading it happens in an effect (external system), so the
// first client render matches the empty SSR output.
export function useCookieNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY) !== "1") {
        setOpen(true);
      }
    } catch {
      // localStorage unavailable (private mode) — the dismissal can't persist
      // anyway; still show the notice, it matters more than the repeat.
      setOpen(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(COOKIE_NOTICE_STORAGE_KEY, "1");
    } catch {
      // Private mode: hidden for this page's lifetime only.
    }
  }, []);

  return { open, dismiss };
}
