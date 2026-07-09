import "src/global.css";

// ----------------------------------------------------------------------
import type { ReactNode } from "react";

import { notFound } from "next/navigation";
import { CONFIG } from "src/config-global";
import { routing } from "src/i18n/routing";
import { Analytics } from "@vercel/analytics/next";
import { Snackbar } from "src/components/snackbar";
import { setRequestLocale } from "next-intl/server";
import { AuthProvider } from "src/auth/context/jwt";
import { ThemeProvider } from "src/theme/theme-provider";
import { ProgressBar } from "src/components/progress-bar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { schemeConfig } from "src/theme/color-scheme-script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { MotionLazy } from "src/components/animate/motion-lazy";
import { Manrope, Unbounded, JetBrains_Mono } from "next/font/google";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { defaultSettings, SettingsProvider } from "src/components/settings";
// Lazy client wrapper: defers the settings drawer (and its simplebar-react
// dependency) out of every route's initial JS. Can't use dynamic({ssr:false})
// directly here — this is a Server Component.
import { SettingsDrawer } from "src/components/settings/drawer/settings-drawer-lazy";

// ----------------------------------------------------------------------

// Editorial Ink stack (see .stitch/DESIGN.md): Manrope — workhorse grotesque
// for body/h3–h6, Unbounded — display face for h1/h2, JetBrains Mono — dates,
// counters, code. All three are Cyrillic-native (the RU content rendered in a
// system fallback before — Public Sans ships no Cyrillic).
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-unbounded",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Pre-render both locale roots at build time so public routes stay static/ISR.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Reject unsupported locales with a 404 rather than silently falling back.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Opt this subtree into static rendering: next-intl reads the locale from
  // this value instead of the request header, so pages aren't forced dynamic.
  setRequestLocale(locale);

  // Render with default settings on the server; the client hydrates persisted
  // settings from the cookie (SettingsProvider mount effect) and the color mode
  // from localStorage (the inline script below, before first paint). Reading
  // the cookie here would call cookies() and force every route dynamic.
  const settings = defaultSettings;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${manrope.variable} ${unbounded.variable} ${jetBrainsMono.variable}`}
    >
      <body suppressHydrationWarning>
        <InitColorSchemeScript {...schemeConfig} />

        <NextIntlClientProvider>
          <AuthProvider>
            <SettingsProvider
              settings={settings}
              caches={CONFIG.isStaticExport ? "localStorage" : "cookie"}
            >
              <ThemeProvider>
                <MotionLazy>
                  <ProgressBar />
                  <SettingsDrawer />
                  <Snackbar />
                  {children}
                  <Analytics />
                  <SpeedInsights />
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
