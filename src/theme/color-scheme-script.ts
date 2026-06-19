"use client";

import { defaultSettings } from "src/components/settings";
import { getInitColorSchemeScript as _getInitColorSchemeScript } from "@mui/material/styles";

// ----------------------------------------------------------------------

type SchemeConfig = NonNullable<
  Parameters<typeof _getInitColorSchemeScript>[0]
>;

export const schemeConfig: SchemeConfig = {
  modeStorageKey: "theme-mode",
  defaultMode: defaultSettings.colorScheme,
};

export const getInitColorSchemeScript = _getInitColorSchemeScript(schemeConfig);
