import "src/global.css";

// ----------------------------------------------------------------------
import type { ReactNode } from "react";

import { CONFIG } from "src/config-global";
import { primary } from "src/theme/core/palette";
import { Analytics } from "@vercel/analytics/next";
import { Snackbar } from "src/components/snackbar";
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

export const metadata = {
  metadataBase: new URL(CONFIG.site.url),
  title: {
    default: "AI-агрегатор новостей: AI, IT и технологии | Talalaev",
    template: "%s | Talalaev",
  },
  description:
    "AI-first агрегатор новостей: нейросеть (LLM) сама находит, фильтрует и кратко пересказывает свежие новости об искусственном интеллекте, IT и технологиях. Без редактора — лента курируется AI.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: `${CONFIG.site.url}/`,
    siteName: "Talalaev — AI-агрегатор новостей",
    title: "AI-агрегатор новостей: AI, IT и технологии | Talalaev",
    description:
      "AI-first агрегатор: нейросеть сама собирает, фильтрует и пересказывает свежие новости об искусственном интеллекте, IT и технологиях.",
    // og:image comes from the file-convention src/app/opengraph-image.tsx —
    // no hardcoded /assets/og-image.jpg (that file never existed → 404, and
    // listing it here would emit a duplicate og:image tag).
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-агрегатор новостей: AI, IT и технологии | Talalaev",
    description:
      "AI-first агрегатор: нейросеть сама собирает, фильтрует и пересказывает свежие новости об искусственном интеллекте, IT и технологиях.",
    // twitter:image also comes from the file-convention opengraph-image.tsx.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: `${CONFIG.site.url}/`,
    types: {
      "application/rss+xml": [
        { url: `${CONFIG.site.url}/feed.xml`, title: "Блог — RSS" },
        { url: `${CONFIG.site.url}/news/feed.xml`, title: "Новости — RSS" },
      ],
    },
  },
  // Search-engine ownership verification. Next renders these as
  // <meta name="google-site-verification"> / <meta name="yandex-verification">
  // only when the env var is set, so an empty value emits nothing. Paste the
  // token from each webmaster panel into .env.local / Vercel env — no code change.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION && {
      other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION },
    }),
  },
};

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
                <Snackbar />
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
