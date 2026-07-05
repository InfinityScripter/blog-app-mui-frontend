import { m } from "framer-motion";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import Container from "@mui/material/Container";
import { varFade, MotionViewport } from "src/components/animate";

import { CONTACT_LINKS } from "./const";
import { ContactCard } from "./contact-card";
import { SectionHeading } from "../components/section-heading";

import type { ContactCardItem } from "./types";

// ----------------------------------------------------------------------

export function HomeContact() {
  const t = useTranslations("home");

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 5, md: 10 },
      }}
    >
      <SectionHeading
        overline={t("contact.overline")}
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      />

      <Grid container spacing={2}>
        {CONTACT_LINKS.map((item) => {
          const resolved: ContactCardItem = {
            icon: item.icon,
            label: t(`contact.links.${item.labelKey}`),
            value: item.valueKey
              ? t(`contact.${item.valueKey}`)
              : (item.value ?? ""),
            href: item.href,
            external: item.external,
          };

          return (
            <Grid key={item.labelKey} size={{ xs: 12, sm: 6, md: 4 }}>
              <m.div variants={varFade().inUp} style={{ height: "100%" }}>
                <ContactCard item={resolved} />
              </m.div>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
