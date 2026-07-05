// Single source of truth for the app's locales. Imported by routing config,
// the language switcher, and the geo→locale mapping in middleware. Adding a
// language = add an entry here + a `messages/<code>.json` catalog + rerun the
// DeepL catalog script. Russian is the original / fallback.

export const LOCALES = ["ru", "en"] as const;

export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "ru";

// Narrow an arbitrary string (e.g. a route `params.locale` or next-intl's
// `useLocale()`) to a supported AppLocale without a type assertion. An
// unrecognised value falls back to the default (Russian original).
function isAppLocale(value: string): value is AppLocale {
  return LOCALES.some((locale) => locale === value);
}

export function toAppLocale(value: string): AppLocale {
  return isAppLocale(value) ? value : DEFAULT_LOCALE;
}

// Display metadata for the language switcher. `native` is the label shown in
// the menu; `ru` is explicitly marked as the original.
interface LocaleMeta {
  code: AppLocale;
  native: string;
  flag: string;
}

export const LOCALE_META: Record<AppLocale, LocaleMeta> = {
  ru: { code: "ru", native: "Русский", flag: "🇷🇺" },
  en: { code: "en", native: "English", flag: "🇬🇧" },
};

// Country (ISO-3166 alpha-2, from the edge `x-vercel-ip-country` header) →
// preferred locale. Russophone regions default to the original; everything
// else falls to English. Unlisted countries use DEFAULT_LOCALE via the
// Accept-Language fallback in the middleware.
export const COUNTRY_TO_LOCALE: Record<string, AppLocale> = {
  RU: "ru",
  BY: "ru",
  KZ: "ru",
  KG: "ru",
  UA: "ru",
  AM: "ru",
  AZ: "ru",
  GE: "ru",
  MD: "ru",
  TJ: "ru",
  TM: "ru",
  UZ: "ru",
};
