"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
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

// The active locale comes from next-intl (URL-derived). Switching replaces the
// current route under the new locale prefix — the locale-aware router keeps the
// same pathname and swaps only the prefix. useLocale() returns a plain string,
// so narrow it back to AppLocale (routing guarantees it is one of LOCALES)
// without a type assertion.
function isAppLocale(value: string): value is AppLocale {
  return LOCALES.some((locale) => locale === value);
}

function toAppLocale(value: string): AppLocale {
  return isAppLocale(value) ? value : "ru";
}

export function useLanguageSwitcher(): UseLanguageSwitcher {
  const router = useRouter();
  const pathname = usePathname();
  const locale = toAppLocale(useLocale());

  const change = useCallback(
    (next: AppLocale) => {
      if (next === locale) return;
      router.replace(pathname, { locale: next });
    },
    [locale, pathname, router],
  );

  return { locale, locales: LOCALES, meta: LOCALE_META, change };
}
