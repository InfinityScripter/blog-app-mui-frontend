import "src/global.css";

// ----------------------------------------------------------------------
import type { ReactNode } from "react";

import { CONFIG } from "src/config-global";
import { primary } from "src/theme/core/palette";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "src/auth/context/jwt";
import { ThemeProvider } from "src/theme/theme-provider";
import { ProgressBar } from "src/components/progress-bar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Onest, Barlow, Public_Sans } from "next/font/google";
import { MotionLazy } from "src/components/animate/motion-lazy";
import { getInitColorSchemeScript } from "src/theme/color-scheme-script";
import { defaultSettings, SettingsProvider } from "src/components/settings";
// Lazy client wrapper: defers the settings drawer (and its simplebar-react
// dependency) out of every route's initial JS. Can't use dynamic({ssr:false})
// directly here — this is a Server Component.
import { SettingsDrawer } from "src/components/settings/drawer/settings-drawer-lazy";

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

// Editorial display face for headings — Cyrillic-first, OFL-licensed.
const onest = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-onest",
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

export default function RootLayout({ children }: RootLayoutProps) {
  // Render with default settings on the server and let the client hydrate the
  // persisted settings from the cookie (SettingsProvider's useCookies mount
  // effect) and the persisted color mode from localStorage (the inline
  // getInitColorSchemeScript below, before first paint). Reading the cookie
  // here via detectSettings() would call cookies() and force EVERY route to
  // render dynamically — defeating ISR/static generation site-wide.
  const settings = defaultSettings;

  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${publicSans.variable} ${barlow.variable} ${onest.variable}`}
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
