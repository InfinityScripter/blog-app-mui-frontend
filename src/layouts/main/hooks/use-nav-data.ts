"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { NAV_ITEMS } from "../../config-nav-main";

import type { MainNavItem } from "../nav/types";

// ----------------------------------------------------------------------

// Resolves the static NAV_ITEMS config into locale-aware main-nav items:
// each item's title comes from the `nav.<key>` message. Paths and icons pass
// through unchanged. Memoised on the translator so it only rebuilds per locale.
export function useNavData(): MainNavItem[] {
  const t = useTranslations("nav");

  return useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        title: t(item.key),
        path: item.path,
        icon: item.icon,
      })),
    [t],
  );
}
