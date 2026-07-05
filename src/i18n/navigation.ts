import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

// Locale-aware wrappers around next/navigation. Internal navigation goes
// through these so the active locale prefix is preserved automatically. The
// existing `src/routes/hooks` re-exports point here, so every consumer of
// useRouter/usePathname/Link across the app becomes locale-aware in one place.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
