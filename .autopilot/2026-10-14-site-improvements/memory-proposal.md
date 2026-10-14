# Что дописать в CLAUDE.md

1. В «Gotchas»: «Every localized page's metadata must use `localizedAlternates(locale, path)`
   (`src/utils/seo-alternates.ts`). A hand-written `canonical` without the locale prefix
   (`/changelog/…`) 307-redirects to `/en/`, so the Russian page tells Google it is a copy of
   the English one — this hit the whole changelog until 2026-10-14.»
2. В «Gotchas»: «Icon-only `IconButton`/links need a localized `aria-label` (next-intl), else
   Lighthouse a11y drops and screen readers announce an unnamed button.»
