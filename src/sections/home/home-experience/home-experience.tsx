import type { MarketingTheme } from "src/sections/home/components/types";

import Timeline from "@mui/lab/Timeline";
import { useTranslations } from "next-intl";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MotionViewport } from "src/components/animate";
import { SectionHeading } from "src/sections/home/components/section-heading";

import { getSortedExperience } from "./utils";
import { ExperienceTimelineItem } from "./experience-timeline-item";

// ----------------------------------------------------------------------

export function HomeExperience() {
  const t = useTranslations("home");
  const theme = useTheme<MarketingTheme>();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    // The cards reveal with varFade().inRight/inLeft, which parks them 120px
    // off their resting x until they scroll into view — that widened the
    // document and gave the page a horizontal scrollbar. `clip` (not `hidden`)
    // cuts the overhang without turning this into a scroll container.
    <Container
      component={MotionViewport}
      sx={{ py: { xs: 6, md: 10 }, overflowX: "clip" }}
    >
      <SectionHeading
        overline={t("experience.overline")}
        title={t("experience.title")}
        subtitle={t("experience.subtitle")}
      />

      <Timeline
        position={isMobile ? "right" : "alternate"}
        sx={{
          [`& .MuiTimelineItem-root`]: {
            minHeight: { xs: "auto", md: "70px" },
            "&:before": {
              display: { xs: "none", md: "block" },
            },
          },
          px: { xs: 0, sm: 2 },
        }}
      >
        {getSortedExperience().map((item, index) => (
          <ExperienceTimelineItem
            key={index}
            item={item}
            isMobile={isMobile}
            theme={theme}
          />
        ))}
      </Timeline>
    </Container>
  );
}
