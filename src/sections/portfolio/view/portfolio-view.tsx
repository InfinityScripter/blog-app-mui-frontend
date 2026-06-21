"use client";

import { HomeAbout } from "src/sections/home/home-about";
import { HomeSkills } from "src/sections/home/home-skills";
import { HomeContact } from "src/sections/home/home-contact";
import { HomeExperience } from "src/sections/home/home-experience";

import { PortfolioHero } from "./portfolio-hero";

// ----------------------------------------------------------------------

export function PortfolioView() {
  return (
    <>
      <PortfolioHero />

      <HomeContact />
      <HomeAbout />
      <HomeSkills />
      <HomeExperience />
    </>
  );
}
