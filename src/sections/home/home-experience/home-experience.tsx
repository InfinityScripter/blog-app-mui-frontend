import type { MarketingTheme } from "src/sections/home/components/types";
import type { ExperienceItem } from "src/sections/home/home-experience/types";

import dayjs from "dayjs";
import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Timeline from "@mui/lab/Timeline";
import Avatar from "@mui/material/Avatar";
import TimelineDot from "@mui/lab/TimelineDot";
import Container from "@mui/material/Container";
import TimelineItem from "@mui/lab/TimelineItem";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import TimelineContent from "@mui/lab/TimelineContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import { varFade, MotionViewport } from "src/components/animate";
import { EXPERIENCE } from "src/sections/home/home-experience/const";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { SectionHeading } from "src/sections/home/components/section-heading";

// ----------------------------------------------------------------------

const DATE_FORMAT = "MMMM YYYY";
const CURRENT_PERIOD_LABEL = "настоящее время";

const formatPeriodDate = (value: string) =>
  dayjs(value).locale("ru").format(DATE_FORMAT);

const getPeriodLabel = (item: ExperienceItem) => {
  const startLabel = formatPeriodDate(item.startDate);

  if (!item.endDate) {
    return `${startLabel} — ${CURRENT_PERIOD_LABEL}`;
  }

  return `${startLabel} — ${formatPeriodDate(item.endDate)}`;
};

const getSortedExperience = () =>
  [...EXPERIENCE].sort(
    (a, b) => dayjs(b.startDate).valueOf() - dayjs(a.startDate).valueOf(),
  );

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
          <TimelineItem key={index}>
            <TimelineOppositeContent
              sx={{
                m: "auto 0",
                display: { xs: isMobile ? "none" : "block", md: "block" },
                flex: { xs: 0, md: 1 },
              }}
            >
              <m.div variants={varFade().inLeft}>
                <Typography variant="subtitle2" color="text.primary">
                  {getPeriodLabel(item)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.location}
                </Typography>
              </m.div>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineConnector
                sx={{ bgcolor: alpha(theme.palette.grey[500], 0.2) }}
              />
              <TimelineDot
                sx={{
                  bgcolor: "background.paper",
                  border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                  boxShadow: "none",
                  p: 0,
                  overflow: "hidden",
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                }}
              >
                <Avatar
                  src={item.logo}
                  alt={`${item.company} logo`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    p: 0.5,
                    bgcolor: "transparent",
                  }}
                />
              </TimelineDot>
              <TimelineConnector
                sx={{ bgcolor: alpha(theme.palette.grey[500], 0.2) }}
              />
            </TimelineSeparator>

            <TimelineContent sx={{ py: "12px", px: { xs: 1, sm: 2 } }}>
              <m.div variants={varFade().inRight}>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  color="inherit"
                  sx={{
                    display: "block",
                    "@media (hover: hover) and (pointer: fine)": {
                      "&:hover .experience-card": {
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                        transform: "translateY(-2px)",
                      },
                    },
                  }}
                >
                  <Box
                    className="experience-card"
                    sx={{
                      p: { xs: 2, sm: 3 },
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                      transition: theme.transitions.create(
                        ["border-color", "transform"],
                        { duration: theme.transitions.duration.shorter },
                      ),
                    }}
                  >
                    <Typography variant="h6" component="div">
                      {item.position}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="primary.main"
                      sx={{ mb: 1 }}
                    >
                      {item.company}
                    </Typography>

                    {isMobile && (
                      <Typography
                        variant="body2"
                        sx={{ mb: 1.5, color: "text.secondary" }}
                      >
                        {getPeriodLabel(item)} • {item.location}
                      </Typography>
                    )}

                    <Box component="ul" sx={{ pl: 2.5, mb: 2, mt: 0 }}>
                      {item.description.map((desc, i) => (
                        <Typography
                          key={i}
                          component="li"
                          variant="body2"
                          sx={{ mb: 0.5, color: "text.secondary" }}
                        >
                          {desc}
                        </Typography>
                      ))}
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "text.disabled",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                      >
                        Технологии:{" "}
                      </Box>
                      {item.technologies}
                    </Typography>
                  </Box>
                </Link>
              </m.div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
}
