"use client";

import type { ListPostsResponse } from "src/types/api";

import { useGetPublicSettings } from "src/actions/settings";

import { HomeHero } from "../home-hero";
import { HomeFeed } from "../home-feed";
import { HomeTelegramCta } from "../home-telegram-cta";
import { HomeNewsletterCta } from "../home-newsletter-cta";
import { BackToTop, ScrollProgress } from "../../../components/animate";

// ----------------------------------------------------------------------

interface HomeViewProps {
  /** Server-rendered posts, forwarded to the feed to seed SWR (SSR/crawlable). */
  initialPosts?: ListPostsResponse;
  /** Server-ranked tag vocabulary for the feed's filter chips. */
  feedTags?: string[];
}

export function HomeView({ initialPosts, feedTags }: HomeViewProps) {
  const { settings } = useGetPublicSettings();

  return (
    <>
      <ScrollProgress />

      <BackToTop />

      {/* Hero section loaded eagerly for fast LCP */}
      <HomeHero />

      {/* News-feed of latest posts with a tag filter */}
      <HomeFeed initialPosts={initialPosts} feedTags={feedTags} />

      {/* Email newsletter capture (double-opt-in) — collects PD, so gated on the
          runtime flag (hidden until it loads, so PD UI never flashes). */}
      {settings?.pdCollection && <HomeNewsletterCta />}

      {/* Telegram subscription CTA — external link, no PD collected. */}
      <HomeTelegramCta />
    </>
  );
}
