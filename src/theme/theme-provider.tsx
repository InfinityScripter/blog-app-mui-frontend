"use client";

import type { ReactNode } from "react";
import type { SettingsState } from "src/types/domain";

import CssBaseline from "@mui/material/CssBaseline";
import { useSettingsContext } from "src/components/settings";
// Стабильный ThemeProvider: CSS-vars режим (бывший Experimental_CssVarsProvider)
// в него влит начиная с MUI v6 — тема из extendTheme включает его автоматически.
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import { createTheme } from "./create-theme";
import { RTL } from "./with-settings/right-to-left";
import { schemeConfig } from "./color-scheme-script";
import { useFontLoader } from "./hooks/use-font-loader";

// ----------------------------------------------------------------------

interface ThemeProviderProps {
  children: ReactNode;
}

function isSettingsState(value: unknown): value is SettingsState {
  return (
    typeof value === "object" &&
    value !== null &&
    "direction" in value &&
    "fontFamily" in value
  );
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const context: unknown = useSettingsContext();

  if (!isSettingsState(context)) {
    throw new Error("ThemeProvider requires settings from SettingsProvider");
  }

  const settings = context;

  const theme = createTheme(settings);

  useFontLoader(settings.fontFamily);

  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      <MuiThemeProvider
        theme={theme}
        defaultMode={schemeConfig.defaultMode}
        modeStorageKey={schemeConfig.modeStorageKey}
      >
        <CssBaseline />
        <RTL direction={settings.direction}>{children}</RTL>
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
