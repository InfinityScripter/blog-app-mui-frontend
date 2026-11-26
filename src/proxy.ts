import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

// Locale for `/` comes from the NEXT_LOCALE cookie (a manual switch), then the
// browser's Accept-Language, then the Russian default. No geo by country:
// Googlebot crawls from the US without Accept-Language, and the old
// "non-Russophone country → /en/" rule made Google index the English home page.
export default createMiddleware(routing);

export const config = {
  // Run on pages only — skip API routes, Next internals, the locale-agnostic
  // SEO endpoints (feed.xml, llms.txt, sitemap), and any file with a dot.
  // `icon` / `opengraph-image` are root metadata routes (src/app/icon.tsx…):
  // without the exclusion the locale rewrite turns /icon/ into /ru/icon/ → 404.
  matcher:
    "/((?!api|_next|_vercel|feed.xml|llms.txt|sitemap.xml|icon|opengraph-image|.*\\..*).*)",
};
