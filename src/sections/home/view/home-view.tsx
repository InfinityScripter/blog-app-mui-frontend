"use client";

import type { ListPostsResponse } from "src/types/api";

import { HomeHero } from "../home-hero";
import { HomeFeed } from "../home-feed";
import { HomeTelegramCta } from "../home-telegram-cta";
import { HomeNewsletterCta } from "../home-newsletter-cta";
import { BackToTop, ScrollProgress } from "../../../components/animate";

// ----------------------------------------------------------------------

interface HomeViewProps {
  /** Server-rendered posts, forwarded to the feed to seed SWR (SSR/crawlable). */
  initialPosts?: ListPostsResponse;
}

export function HomeView({ initialPosts }: HomeViewProps) {
  return (
    <>
      <ScrollProgress />

      <BackToTop />

      {/* Hero section loaded eagerly for fast LCP */}
      <HomeHero />

      {/* News-feed of latest posts with a tag filter */}
      <HomeFeed initialPosts={initialPosts} />

      {/* Email newsletter capture (double-opt-in) */}
      <HomeNewsletterCta />

      {/* Telegram subscription CTA */}
      <HomeTelegramCta />
    </>
  );
}
