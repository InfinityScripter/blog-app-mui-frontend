import type { Metadata } from "next";

import { CONFIG } from "src/config-global";
import { LOCALES, DEFAULT_LOCALE, type AppLocale } from "src/i18n/locales";

// Builds the `{ alternates }` metadata fragment for a localized page: a
// locale-prefixed canonical plus `hreflang` links for every locale (and
// `x-default` → the original). Returns the WRAPPED `{ alternates: … }` so call
// sites can spread it straight into their metadata object
// (`...localizedAlternates(locale, path)`). `path` is the locale-less path with
// surrounding slashes, e.g. "/post/" or "/". The site uses
// `localePrefix: "always"`, so every URL carries its `/ru` or `/en` prefix.
export function localizedAlternates(
  locale: string,
  path: string,
): Pick<Metadata, "alternates"> {
  const base = CONFIG.site.url;
  const languages: Record<string, string> = {};

  LOCALES.forEach((code) => {
    languages[code] = `${base}/${code}${path}`;
  });
  languages["x-default"] = `${base}/${DEFAULT_LOCALE}${path}`;

  return {
    alternates: {
      canonical: `${base}/${locale}${path}`,
      languages,
    },
  };
}

export function localizedPageMetadata(
  locale: AppLocale,
  path: string,
  content: { title: string; description: string },
): Metadata {
  const image = `${CONFIG.site.url}/opengraph-image/`;

  return {
    ...content,
    ...localizedAlternates(locale, path),
    openGraph: {
      ...content,
      type: "website",
      siteName: "Life Style",
      locale: locale === "en" ? "en_US" : "ru_RU",
      url: `${CONFIG.site.url}/${locale}${path}`,
      images: [image],
    },
    twitter: { ...content, card: "summary_large_image", images: [image] },
  };
}
