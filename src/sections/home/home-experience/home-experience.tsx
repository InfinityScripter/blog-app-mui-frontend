import type { ExperienceItem } from "src/sections/home/home-experience/types";

import dayjs from "dayjs";
import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDarkMode = theme.palette.mode === "dark";
  const cardBorderColor = isDarkMode
    ? alpha(theme.palette.common.white, 0.34)
    : alpha(theme.palette.common.black, 0.22);
  const cardTitleColor = isDarkMode
    ? "rgba(255, 255, 255, 0.96)"
    : "text.primary";
  const cardBodyColor = isDarkMode
    ? "rgba(255, 255, 255, 0.84)"
    : "text.primary";
  const cardMetaColor = isDarkMode
    ? "rgba(255, 255, 255, 0.72)"
    : "text.secondary";

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 5, md: 10 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: "center",
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inDown}>
          <Typography variant="h2">Опыт работы</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: "text.secondary" }}>
            Мой профессиональный путь как веб-разработчика
          </Typography>
        </m.div>
      </Stack>

      <Timeline
        position={isMobile ? "right" : "alternate"}
        sx={{
          [`& .MuiTimelineItem-root`]: {
            minHeight: { xs: "auto", md: "70px" },
            "&:before": {
              // This removes the line on the left side for mobile view
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
                <Typography variant="subtitle1" color="text.primary">
                  {getPeriodLabel(item)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.76)"
                      : "text.secondary",
                  }}
                >
                  {item.location}
                </Typography>
              </m.div>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: theme.customShadows.z8,
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
                  }}
                />
              </TimelineDot>
              <TimelineConnector />
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
                    "&:hover": {
                      "& .experience-card": {
                        borderColor: isDarkMode
                          ? alpha(theme.palette.common.white, 0.62)
                          : alpha(theme.palette.primary.main, 0.6),
                        backgroundColor: isDarkMode
                          ? alpha(theme.palette.common.white, 0.03)
                          : alpha(theme.palette.common.black, 0.02),
                        transition: theme.transitions.create(
                          ["border-color", "background-color"],
                          {
                            duration: theme.transitions.duration.shorter,
                          },
                        ),
                      },
                    },
                  }}
                >
                  <Box
                    className="experience-card"
                    sx={{
                      p: { xs: 2, sm: 3 },
                      color: cardBodyColor,
                      bgcolor: "transparent",
                      borderRadius: 2,
                      border: `1px solid ${cardBorderColor}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      gutterBottom
                      sx={{ color: cardTitleColor }}
                    >
                      {item.position}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary.main"
                      gutterBottom
                    >
                      {item.company}
                    </Typography>

                    {/* Show period and location on mobile */}
                    {isMobile && (
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: cardMetaColor }}
                      >
                        {getPeriodLabel(item)} • {item.location}
                      </Typography>
                    )}

                    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                      {item.description.map((desc, i) => (
                        <Typography
                          key={i}
                          component="li"
                          variant="body2"
                          sx={{ mb: 0.5, color: cardBodyColor }}
                        >
                          {desc}
                        </Typography>
                      ))}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        color: cardMetaColor,
                      }}
                    >
                      <strong>Технологии:</strong> {item.technologies}
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
