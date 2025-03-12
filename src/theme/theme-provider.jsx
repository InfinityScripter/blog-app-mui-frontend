"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

import { useSettingsContext } from "src/components/settings";

import { createTheme } from "./create-theme";
import { RTL } from "./with-settings/right-to-left";
import { schemeConfig } from "./color-scheme-script";

// ----------------------------------------------------------------------

export function ThemeProvider({ children }) {
  const settings = useSettingsContext();

  const theme = createTheme(settings);

  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      <CssVarsProvider
        theme={theme}
        defaultMode={schemeConfig.defaultMode}
        modeStorageKey={schemeConfig.modeStorageKey}
      >
        <CssBaseline />
        <RTL direction={settings.direction}>{children}</RTL>
      </CssVarsProvider>
    </AppRouterCacheProvider>
  );
}
