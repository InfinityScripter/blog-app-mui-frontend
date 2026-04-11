import "src/global.css";

// ----------------------------------------------------------------------
import type { ReactNode } from "react";

import { CONFIG } from "src/config-global";
import { primary } from "src/theme/core/palette";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "src/auth/context/jwt";
import { Barlow, Public_Sans } from "next/font/google";
import { ThemeProvider } from "src/theme/theme-provider";
import { ProgressBar } from "src/components/progress-bar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionLazy } from "src/components/animate/motion-lazy";
import { detectSettings } from "src/components/settings/server";
import { getInitColorSchemeScript } from "src/theme/color-scheme-script";
import {
  SettingsDrawer,
  defaultSettings,
  SettingsProvider,
} from "src/components/settings";

// ----------------------------------------------------------------------

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: primary.main,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const settings = CONFIG.isStaticExport
    ? defaultSettings
    : await detectSettings();

  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${publicSans.variable} ${barlow.variable}`}
    >
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
