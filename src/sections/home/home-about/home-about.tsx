import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { varFade, MotionViewport } from "src/components/animate";

import { ABOUT_TITLE, ABOUT_PROFILE, ABOUT_PARAGRAPHS } from "./const";

// ----------------------------------------------------------------------

export function HomeAbout() {
  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 5, md: 10 },
      }}
    >
      <Box sx={{ maxWidth: 760, mx: "auto" }}>
        {/* Profile header — компактный, без огромного фото */}
        <m.div variants={varFade().inUp}>
          <Stack
            direction="row"
            spacing={2.5}
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Avatar
              src={ABOUT_PROFILE.imageSrc}
              alt={ABOUT_PROFILE.imageAlt}
              sx={{
                width: { xs: 72, md: 88 },
                height: { xs: 72, md: 88 },
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            />

            <Box>
              <Typography variant="h5">{ABOUT_PROFILE.name}</Typography>
              <Chip
                label={ABOUT_PROFILE.role}
                size="small"
                color="primary"
                variant="soft"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Stack>
        </m.div>

        <m.div variants={varFade().inUp}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            {ABOUT_TITLE}
          </Typography>
        </m.div>

        <m.div variants={varFade().inUp}>
          <Divider sx={{ mb: 3 }} />
        </m.div>

        <Stack spacing={2.5}>
          {ABOUT_PARAGRAPHS.map((paragraph, index) => (
            <m.div key={index} variants={varFade().inUp}>
              <Typography
                sx={{
                  color: "text.secondary",
                  typography: "body1",
                }}
              >
                {paragraph}
              </Typography>
            </m.div>
          ))}
        </Stack>
      </Box>
    </Container>
  );
}
