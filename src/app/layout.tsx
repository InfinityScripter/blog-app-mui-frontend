import "src/global.css";

// ----------------------------------------------------------------------
import { CONFIG } from "src/config-global";
import { primary } from "src/theme/core/palette";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "src/auth/context/jwt";
import { ThemeProvider } from "src/theme/theme-provider";
import { ProgressBar } from "src/components/progress-bar";
import { MotionLazy } from "src/components/animate/motion-lazy";
import { detectSettings } from "src/components/settings/server";
import { getInitColorSchemeScript } from "src/theme/color-scheme-script";
import {
  SettingsDrawer,
  defaultSettings,
  SettingsProvider,
} from "src/components/settings";

// ----------------------------------------------------------------------

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: primary.main,
};

import type { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const settings = CONFIG.isStaticExport
    ? defaultSettings
    : await detectSettings();

  return (
    <html lang="ru" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {getInitColorSchemeScript}

        <AuthProvider>
          <SettingsProvider
            settings={settings}
            caches={CONFIG.isStaticExport ? "localStorage" : "cookie"}
          >
            <ThemeProvider>
              <MotionLazy>
                <ProgressBar />
                <SettingsDrawer />
                {children}
                <Analytics />
                <SpeedInsights />
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
