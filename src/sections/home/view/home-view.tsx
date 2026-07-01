"use client";

import { HomeHero } from "../home-hero";
import { HomeFeed } from "../home-feed";
import { HomeTelegramCta } from "../home-telegram-cta";
import { HomeNewsletterCta } from "../home-newsletter-cta";
import { BackToTop, ScrollProgress } from "../../../components/animate";

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <ScrollProgress />

      <BackToTop />

      {/* Hero section loaded eagerly for fast LCP */}
      <HomeHero />

      {/* News-feed of latest posts with a tag filter */}
      <HomeFeed />

      {/* Email newsletter capture (double-opt-in) */}
      <HomeNewsletterCta />

      {/* Telegram subscription CTA */}
      <HomeTelegramCta />
    </>
  );
}
