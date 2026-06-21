import type { Theme } from "@mui/material/styles";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { varFade, MotionViewport } from "src/components/animate";

import {
  ABOUT_LEAD,
  ABOUT_STACK,
  ABOUT_TITLE,
  ABOUT_PROFILE,
  ABOUT_HIGHLIGHTS,
} from "./const";

// ----------------------------------------------------------------------

export function HomeAbout() {
  return (
    <Container component={MotionViewport} sx={{ py: { xs: 6, md: 10 } }}>
      <Stack
        spacing={{ xs: 4, md: 5 }}
        sx={{
          maxWidth: 860,
          mx: "auto",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        {/* Identity — small avatar, name, role, contact */}
        <m.div variants={varFade().inUp}>
          <Stack
            spacing={2.5}
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "center", sm: "center" }}
          >
            <Avatar
              src={ABOUT_PROFILE.imageSrc}
              alt={ABOUT_PROFILE.imageAlt}
              sx={(theme: Theme) => ({
                width: 88,
                height: 88,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.32)}`,
              })}
            />

            <Stack
              spacing={0.5}
              alignItems={{ xs: "center", sm: "flex-start" }}
            >
              <Typography
                variant="overline"
                sx={{ color: "primary.main", letterSpacing: 1.2 }}
              >
                {ABOUT_TITLE}
              </Typography>
              <Typography variant="h3" sx={{ lineHeight: 1.1 }}>
                {ABOUT_PROFILE.name}
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                flexWrap="wrap"
                justifyContent={{ xs: "center", sm: "flex-start" }}
                sx={{ color: "text.secondary" }}
              >
                <Typography variant="subtitle2">
                  {ABOUT_PROFILE.role}
                </Typography>
                <Link
                  href={`mailto:${ABOUT_PROFILE.email}`}
                  variant="subtitle2"
                  underline="hover"
                  sx={{ color: "text.secondary" }}
                >
                  {ABOUT_PROFILE.email}
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </m.div>

        {/* Lead — one tight paragraph */}
        <m.div variants={varFade().inUp}>
          <Typography
            sx={{
              color: "text.secondary",
              typography: "body1",
              fontSize: { md: "1.0625rem" },
              lineHeight: 1.7,
            }}
          >
            {ABOUT_LEAD}
          </Typography>
        </m.div>

        {/* Stack chips */}
        <m.div variants={varFade().inUp}>
          <Stack
            direction="row"
            flexWrap="wrap"
            useFlexGap
            spacing={1}
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            {ABOUT_STACK.map((tech) => (
              <Chip
                key={tech}
                label={tech}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Stack>
        </m.div>

        {/* Scannable credential highlights */}
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          }}
        >
          {ABOUT_HIGHLIGHTS.map((item) => (
            <m.div key={item.label} variants={varFade().inUp}>
              <Stack
                spacing={1.5}
                sx={(theme: Theme) => ({
                  p: 2.5,
                  height: 1,
                  borderRadius: 2,
                  textAlign: "left",
                  border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                })}
              >
                <Iconify
                  icon={item.icon}
                  width={28}
                  sx={{ color: "primary.main" }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "text.disabled",
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="subtitle1">{item.value}</Typography>
                </Box>
              </Stack>
            </m.div>
          ))}
        </Box>
      </Stack>
    </Container>
  );
}
