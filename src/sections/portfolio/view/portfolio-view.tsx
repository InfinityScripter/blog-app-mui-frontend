"use client";

import { HomeExperience } from "src/sections/home/home-experience";

import { PortfolioHero } from "./portfolio-hero";

// ----------------------------------------------------------------------

export function PortfolioView() {
  return (
    <>
      <PortfolioHero />

      {/* <HomeAbout /> */}
      {/* <HomeSkills /> */}
      <HomeExperience />
      {/* <HomeProjects /> */}
    </>
  );
}
