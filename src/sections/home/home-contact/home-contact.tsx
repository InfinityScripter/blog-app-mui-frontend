import { m } from "framer-motion";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { varFade, MotionViewport } from "src/components/animate";

import { ContactCard } from "./contact-card";
import { CONTACT_TITLE, CONTACT_LINKS, CONTACT_SUBTITLE } from "./const";

// ----------------------------------------------------------------------

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
