import type { ReactNode } from "react";

import { CONFIG } from "src/config-global";
import { primary } from "src/theme/core/palette";

// ----------------------------------------------------------------------
//
// Root layout is a bare passthrough: the `<html>`/`<body>` shell, fonts and the
// whole provider tree live in `src/app/[locale]/layout.tsx`, which is the only
// layout that can read the active locale (from the `[locale]` segment) and set
// `<html lang>` accordingly. Next.js still requires a root layout to exist, so
// this returns children unwrapped. Metadata here is the site-wide default;
// per-locale routes extend it via `generateMetadata`.
//
// ----------------------------------------------------------------------

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
  return children;
}
