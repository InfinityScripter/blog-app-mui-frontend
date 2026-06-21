import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { varFade, MotionViewport } from "src/components/animate";

import { CONTACT_TITLE, CONTACT_LINKS, CONTACT_SUBTITLE } from "./const";

import type { ContactLink } from "./types";

// ----------------------------------------------------------------------

function ContactCard({ item }: { item: ContactLink }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const borderColor = isDarkMode
    ? alpha(theme.palette.common.white, 0.16)
    : alpha(theme.palette.grey[500], 0.24);

  const isInteractive = Boolean(item.href);

  const card = (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        height: 1,
        borderColor,
        bgcolor: "transparent",
        transition: theme.transitions.create(
          ["border-color", "background-color", "transform"],
          { duration: theme.transitions.duration.shorter },
        ),
        ...(isInteractive && {
          "@media (hover: hover) and (pointer: fine)": {
            "&:hover": {
              transform: "translateY(-4px)",
              borderColor: alpha(theme.palette.primary.main, 0.6),
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
          },
        }),
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1.5,
            color: "primary.main",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <Iconify icon={item.icon} width={24} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {item.label}
          </Typography>
          <Typography variant="subtitle2" noWrap sx={{ color: "text.primary" }}>
            {item.value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  if (!item.href) {
    return card;
  }

  return (
    <Link
      href={item.href}
      underline="none"
      color="inherit"
      {...(item.external && { target: "_blank", rel: "noopener" })}
      sx={{ display: "block", height: 1 }}
    >
      {card}
    </Link>
  );
}

export function HomeContact() {
  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 5, md: 10 },
      }}
    >
      <Stack
        spacing={2}
        sx={{
          textAlign: "center",
          mb: { xs: 4, md: 6 },
        }}
      >
        <m.div variants={varFade().inDown}>
          <Typography variant="h2">{CONTACT_TITLE}</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: "text.secondary" }}>
            {CONTACT_SUBTITLE}
          </Typography>
        </m.div>
      </Stack>

      <Grid container spacing={2} justifyContent="center">
        {CONTACT_LINKS.map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6, md: 4 }}>
            <m.div variants={varFade().inUp} style={{ height: "100%" }}>
              <ContactCard item={item} />
            </m.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
