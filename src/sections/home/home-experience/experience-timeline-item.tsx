import type { ExperienceTimelineItemProps } from "src/sections/home/home-experience/types";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import { useTranslations } from "next-intl";
import { alpha } from "@mui/material/styles";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import { varFade } from "src/components/animate";
import Typography from "@mui/material/Typography";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

import { getPeriodLabel } from "./utils";

// ----------------------------------------------------------------------

export function ExperienceTimelineItem({
  item,
  isMobile,
  theme,
}: ExperienceTimelineItemProps) {
  const t = useTranslations("home");
  const periodLabel = getPeriodLabel(item, t("experience.present"));

  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{
          m: "auto 0",
          display: { xs: isMobile ? "none" : "block", md: "block" },
          flex: { xs: 0, md: 1 },
        }}
      >
        <m.div variants={varFade().inLeft}>
          <Typography variant="subtitle2" color="text.primary">
            {periodLabel}
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
                  {periodLabel} • {item.location}
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
                  {t("experience.technologies")}{" "}
                </Box>
                {item.technologies}
              </Typography>
            </Box>
          </Link>
        </m.div>
      </TimelineContent>
    </TimelineItem>
  );
}
