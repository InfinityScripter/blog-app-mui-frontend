"use client";

import { HomeAbout } from "src/sections/home/home-about";
import { HomeSkills } from "src/sections/home/home-skills";
import { HomeProjects } from "src/sections/home/home-projects";
import { HomeExperience } from "src/sections/home/home-experience";

import { PortfolioHero } from "./portfolio-hero";

// ----------------------------------------------------------------------

export function PortfolioView() {
  return (
    <>
      <PortfolioHero />

      <HomeAbout />
      <HomeSkills />
      <HomeExperience />
      <HomeProjects />
    </>
  );
}
