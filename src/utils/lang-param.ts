import { DEFAULT_LOCALE, type AppLocale } from "src/i18n/locales";

// Builds the `lang` query fragment for backend post reads. The default locale
// (Russian) is the original content, so it sends NO param — the response stays
// byte-identical to the pre-i18n behaviour (per the i18n contract). Any other
// locale appends `&lang=<code>` (or `?lang=` when the URL has no query yet), so
// the backend returns the cached/translated version.
export function langQuery(locale: AppLocale, hasQuery: boolean): string {
  if (locale === DEFAULT_LOCALE) return "";
  return `${hasQuery ? "&" : "?"}lang=${locale}`;
}
