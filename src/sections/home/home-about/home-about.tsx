import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { varFade, MotionViewport } from "src/components/animate";

import { ABOUT_TITLE, ABOUT_PROFILE, ABOUT_PARAGRAPHS } from "./const";

// ----------------------------------------------------------------------

export function HomeAbout() {
  const theme = useTheme();

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 5, md: 10 },
      }}
    >
      <Box
        sx={{
          gap: 3,
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        }}
      >
        {/* Left side - Image */}
        <Box>
          <m.div variants={varFade().inUp}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: theme.shadows[24],
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={ABOUT_PROFILE.imageSrc}
                alt={ABOUT_PROFILE.imageAlt}
                loading="lazy"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 1,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.8),
                  backdropFilter: "blur(8px)",
                }}
              >
                <Typography variant="h5">{ABOUT_PROFILE.name}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {ABOUT_PROFILE.role}
                </Typography>
              </Box>
            </Card>
          </m.div>
        </Box>

        {/* Right side - Content */}
        <Box>
          <m.div variants={varFade().inUp}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              {ABOUT_TITLE}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                mb: 3,
                typography: "body1",
              }}
            >
              {ABOUT_PARAGRAPHS[0]}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                mb: 3,
                typography: "body1",
              }}
            >
              {ABOUT_PARAGRAPHS[1]}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                mb: 4,
                typography: "body1",
              }}
            >
              {ABOUT_PARAGRAPHS[2]}
            </Typography>
          </m.div>
        </Box>
      </Box>
    </Container>
  );
}
