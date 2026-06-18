"use client";

import nextDynamic from "next/dynamic";

/**
 * Client-side lazy wrapper for the settings drawer.
 *
 * The drawer renders nothing until the user opens it and is never part of the
 * SSR HTML, so deferring it (ssr: false) keeps simplebar-react and the drawer
 * option components out of every route's initial JS bundle. `ssr: false` is
 * only allowed inside a Client Component, hence this wrapper — the root layout
 * is a Server Component and imports this instead of calling dynamic() itself.
 */
export const SettingsDrawer = nextDynamic(
  () => import("./settings-drawer").then((m) => m.SettingsDrawer),
  { ssr: false },
);
