"use client";

import { useGetPublicSettings } from "src/actions/settings";

import { HomeHero } from "../home-hero";
import { HomeFresh } from "../home-fresh";
import { HomeSeriesMap } from "../home-series";
import { Ribbons } from "../components/ribbons";
import { HomeTelegramCta } from "../home-telegram-cta";
import { HomeNewsletterCta } from "../home-newsletter-cta";
import { BackToTop, ScrollProgress } from "../../../components/animate";

// ----------------------------------------------------------------------

export function HomeView() {
  const { settings } = useGetPublicSettings();

  return (
    <>
      <ScrollProgress />

      <BackToTop />

      <HomeHero />

      <Ribbons />

      <HomeSeriesMap />

      <HomeFresh />

      {settings?.pdCollection && <HomeNewsletterCta />}

      <HomeTelegramCta />
    </>
  );
}
