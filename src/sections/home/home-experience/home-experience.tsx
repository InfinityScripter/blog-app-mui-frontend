import type { MarketingTheme } from "src/sections/home/components/types";

import Timeline from "@mui/lab/Timeline";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MotionViewport } from "src/components/animate";
import { SectionHeading } from "src/sections/home/components/section-heading";

import { getSortedExperience } from "./utils";
import { ExperienceTimelineItem } from "./experience-timeline-item";

// ----------------------------------------------------------------------

export function HomeExperience() {
  const theme = useTheme<MarketingTheme>();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container component={MotionViewport} sx={{ py: { xs: 6, md: 10 } }}>
      <SectionHeading
        overline="Карьера"
        title="Опыт работы"
        subtitle="Профессиональный путь как веб-разработчика"
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
