import { defineRouting } from "next-intl/routing";

import { LOCALES, DEFAULT_LOCALE } from "./locales";

// Shared routing config used by the middleware and the navigation wrappers.
// `localePrefix: "always"` → both /ru and /en carry a visible prefix (root `/`
// is redirected by the middleware). This gives every language its own URL for
// SEO/hreflang and makes an EN link shareable, and keeps switching back to the
// Russian original an explicit, addressable choice.
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
});
