import { DEFAULT_LOCALE } from "./locales";

// For content-list pages (news feed, blog list, changelog) that fetch and
// translate a whole list at render time: prebuild ONLY the default-locale
// (Russian original) variant at build. The translated (`en`) variant would
// otherwise translate the entire list during `next build` — slow, and it burns
// the DeepL quota/rate-limit on every deploy. Returning just the default locale
// here makes the non-default variants render on demand on first request and
// then ISR-cache, so each translated list is produced once, lazily, off the
// build's critical path. Next crosses these with the page's other dynamic
// params; a page with only `[locale]` gets exactly the one default-locale route.
export function defaultLocaleStaticParams(): Array<{ locale: string }> {
  return [{ locale: DEFAULT_LOCALE }];
}
