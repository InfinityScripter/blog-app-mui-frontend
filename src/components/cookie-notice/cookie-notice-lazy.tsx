"use client";

import nextDynamic from "next/dynamic";

/**
 * Client-side lazy wrapper for the cookie notice.
 *
 * The notice reads localStorage and renders nothing for visitors who already
 * dismissed it, so deferring it (ssr: false) keeps it out of the SSR HTML and
 * out of every route's initial JS. `ssr: false` is only allowed inside a
 * Client Component, hence this wrapper — the locale layout is a Server
 * Component and imports this instead of calling dynamic() itself.
 */
export const CookieNotice = nextDynamic(
  () => import("./cookie-notice").then((m) => m.CookieNotice),
  { ssr: false },
);
