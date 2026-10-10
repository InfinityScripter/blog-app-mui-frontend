"use client";

import { useGetPublicSettings } from "src/actions/settings";

import { HomeHero } from "../home-hero";
import { Ribbons } from "../components/ribbons";
import { HomeTelegramCta } from "../home-telegram-cta";
import { HomeNewsletterCta } from "../home-newsletter-cta";
import { HomeSeriesMap, HomeSeriesQuiz } from "../home-series";
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

      <HomeSeriesQuiz />

      {settings?.pdCollection && <HomeNewsletterCta />}

      <HomeTelegramCta />
    </>
  );
}
