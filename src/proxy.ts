import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "./i18n/routing";
import { type AppLocale, COUNTRY_TO_LOCALE } from "./i18n/locales";

// next-intl reads this cookie to remember the user's language across visits.
// A manual switch (via the language switcher) writes it too, so a deliberate
// choice always wins over geo.
const LOCALE_COOKIE = "NEXT_LOCALE";

const intlMiddleware = createMiddleware(routing);

// Geo → locale seeding. On the very first visit (no locale cookie) we look at
// the edge-provided country and plant a cookie BEFORE next-intl negotiates, so
// it redirects `/` to the geo-preferred prefix. Rule: a Russophone country →
// the Russian original; ANY other known country → English (the site's second
// language). Only when the country is absent (no edge geo, e.g. local dev) do
// we return undefined and let next-intl fall back to Accept-Language → default.
// A manual switch writes the cookie, so this never overrides a real choice.
function resolveGeoLocale(request: NextRequest): AppLocale | undefined {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (!country) return undefined;
  return COUNTRY_TO_LOCALE[country] ?? "en";
}

export default function middleware(request: NextRequest): NextResponse {
  const hasLocaleCookie = request.cookies.has(LOCALE_COOKIE);

  if (!hasLocaleCookie) {
    const geoLocale = resolveGeoLocale(request);
    if (geoLocale) {
      // Seed the cookie on the incoming request so next-intl's negotiation
      // sees it this pass, and persist it on the response for next time.
      request.cookies.set(LOCALE_COOKIE, geoLocale);
      const response = intlMiddleware(request);
      response.cookies.set(LOCALE_COOKIE, geoLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Run on pages only — skip API routes, Next internals, the locale-agnostic
  // SEO endpoints (feed.xml, llms.txt, sitemap), and any file with a dot.
  matcher: "/((?!api|_next|_vercel|feed.xml|llms.txt|sitemap.xml|.*\\..*).*)",
};
