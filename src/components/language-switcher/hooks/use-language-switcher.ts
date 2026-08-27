"use client";

import { useCallback } from "react";
import { useAppLocale } from "src/hooks/use-app-locale";
import { useRouter, usePathname } from "src/routes/hooks";
import { LOCALES, LOCALE_META, type AppLocale } from "src/i18n/locales";

// ----------------------------------------------------------------------

interface UseLanguageSwitcher {
  locale: AppLocale;
  locales: readonly AppLocale[];
  meta: typeof LOCALE_META;
  /** Switch the site language, preserving the current path. Writes the cookie
   *  (via next-intl) so the choice sticks and overrides geo on the next visit. */
  change: (next: AppLocale) => void;
}

// The active locale comes from next-intl (URL-derived, narrowed to AppLocale
// by useAppLocale — the file used to keep its own toAppLocale copy). Switching
// replaces the current route under the new locale prefix — the locale-aware
// router keeps the same pathname and swaps only the prefix.
export function useLanguageSwitcher(): UseLanguageSwitcher {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useAppLocale();

  const change = useCallback(
    (next: AppLocale) => {
      if (next === locale) return;
      router.replace(pathname, { locale: next });
    },
    [locale, pathname, router],
  );

  return { locale, locales: LOCALES, meta: LOCALE_META, change };
}
