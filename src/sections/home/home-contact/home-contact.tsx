import { m } from "framer-motion";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { varFade, MotionViewport } from "src/components/animate";

import { ContactCard } from "./contact-card";
import { SectionHeading } from "../components/section-heading";
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
      <SectionHeading
        overline="Связаться"
        title={CONTACT_TITLE}
        subtitle={CONTACT_SUBTITLE}
      />

      <Grid container spacing={2}>
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
