'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { BackToTop } from 'src/components/animate/back-to-top';
import { ScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeHero } from '../home-hero';
import HomeSkills from '../home-skills';
import {HomeProjects} from '../home-projects';
import HomeExperience from '../home-experience';

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <ScrollProgress />

      <BackToTop />

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <Container
          sx={{
            py: { xs: 10, md: 15 },
            maxWidth: '1200px !important',
          }}
        >
          <HomeSkills />

          <Box sx={{ height: { xs: 40, md: 80 } }} />

          <HomeProjects />

          <Box sx={{ height: { xs: 40, md: 80 } }} />

          <HomeExperience />
        </Container>
      </Box>
    </>
  );
}
