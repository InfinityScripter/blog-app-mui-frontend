"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import HomeAbout from "../home-about";
import { HomeHero } from "../home-hero";
import HomeSkills from "../home-skills";
import HomeContact from "../home-contact";
import HomeLanguages from "../home-languages";
import HomeEducation from "../home-education";
import HomeExperience from "../home-experience";
import { HomeProjects } from "../home-projects";
import { BackToTop, ScrollProgress } from "../../../components/animate";

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <ScrollProgress />

      <BackToTop />

      <HomeHero />

      <Box
        sx={{
          overflow: "hidden",
          position: "relative",
          bgcolor: "background.default",
        }}
      >
        <Container
          sx={{
            py: { xs: 10, md: 15 },
            maxWidth: "1200px !important",
          }}
        >
          <HomeAbout />

          <Box sx={{ height: { xs: 40, md: 80 } }} />

          <HomeSkills />

          <Box sx={{ height: { xs: 40, md: 80 } }} />

          <HomeExperience />

          <Box sx={{ height: { xs: 40, md: 80 } }} />

          <HomeEducation />

          <Box sx={{ height: { xs: 40, md: 80 } }} />

          <HomeLanguages />

          <Box sx={{ height: { xs: 40, md: 80 } }} />

          <HomeProjects />

          <Box sx={{ height: { xs: 40, md: 80 } }} />

        </Container>
      </Box>
    </>
  );
}
