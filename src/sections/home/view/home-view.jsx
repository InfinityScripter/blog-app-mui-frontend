"use client";

import {Suspense} from "react";
import dynamic from "next/dynamic";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";

import {HomeHero} from "../home-hero";
import {BackToTop, ScrollProgress} from "../../../components/animate";

// Lazy load non-critical components with next/dynamic
const HomeAbout = dynamic(
  () => import("../home-about").then(mod => mod.HomeAbout),
  {ssr: true}
);
const HomeSkills = dynamic(
  () => import("../home-skills").then(mod => mod.HomeSkills),
  {ssr: true}
);

const HomeExperience = dynamic(
  () => import("../home-experience").then(mod => mod.HomeExperience),
  {ssr: true}
);

const HomeProjects = dynamic(
  () => import("../home-projects").then(mod => mod.HomeProjects),
  {ssr: true}
);
// Fallback loading component
const SectionLoader = () => (
  <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
    <CircularProgress/>
  </Box>
);

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <ScrollProgress/>

      <BackToTop/>

      {/* Hero section loaded eagerly for fast LCP */}
      <HomeHero/>

      <Box
        sx={{
          overflow: "hidden",
          position: "relative",
          bgcolor: "background.default",
        }}
      >
        <Container
          sx={{
            py: {xs: 10, md: 15},
            maxWidth: "1200px !important",
          }}
        >
          <Suspense fallback={<SectionLoader/>}>
            <HomeAbout/>

            <Box sx={{height: {xs: 40, md: 80}}}/>

            <HomeSkills/>

            <Box sx={{height: {xs: 40, md: 80}}}/>

            <HomeExperience/>

            <Box sx={{height: {xs: 40, md: 80}}}/>

            <HomeProjects/>

            <Box sx={{height: {xs: 40, md: 80}}}/>
          </Suspense>
        </Container>
      </Box>
    </>
  );
}
