"use client";

import { HomeHero } from "../home-hero";
import { BackToTop, ScrollProgress } from "../../../components/animate";

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <ScrollProgress />

      <BackToTop />

      {/* Hero section loaded eagerly for fast LCP */}
      <HomeHero />
    </>
  );
}
