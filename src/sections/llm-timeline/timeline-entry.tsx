import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { Label } from "src/components/label";
import Collapse from "@mui/material/Collapse";
import { fDate } from "src/utils/format-time";
import TimelineDot from "@mui/lab/TimelineDot";
import { useTheme } from "@mui/material/styles";
import { Iconify } from "src/components/iconify";
import TimelineItem from "@mui/lab/TimelineItem";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

import { TimelineDetail } from "./timeline-detail";
import {
  eraLabel,
  vendorIcon,
  vendorColor,
  hasBrandIcon,
  yearAnchorId,
} from "./utils";

import type { LlmModel } from "./types";

// ----------------------------------------------------------------------

interface TimelineEntryProps {
  model: LlmModel;
  expanded: boolean;
  onToggle: (id: string) => void;
  /** The year to show above the date when this is the first model of its year. */
  yearStart: number | null;
}

/**
 * One model on the vertical axis: a brand-colored dot, opposite-side date (with
 * a year chip when the year changes) and a clickable card carrying the vendor
 * brand icon, Label, name and highlight. Clicking expands the detail panel.
 * Rendered inside a `position="alternate"` Timeline, so items zig-zag L/R.
 */
export function TimelineEntry({
  model,
  expanded,
  onToggle,
  yearStart,
}: TimelineEntryProps) {
  const theme = useTheme();
  const color = vendorColor(model.vendor);
  const brand = hasBrandIcon(model.vendor);

  const era = yearStart !== null ? eraLabel(yearStart) : null;

  return (
    <TimelineItem
      {...(yearStart !== null && {
        id: yearAnchorId(yearStart),
        "data-year": yearStart,
      })}
      sx={{ scrollMarginTop: 96 }}
    >
      <TimelineOppositeContent
        sx={{ m: "auto 0", color: "text.disabled" }}
        variant="caption"
      >
        {yearStart !== null && (
          <Chip
            label={yearStart}
            color="primary"
            size="small"
            variant="soft"
            sx={{ mb: 0.5 }}
          />
        )}
        {era !== null && (
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 0.5, fontStyle: "italic" }}
          >
            {era}
          </Typography>
        )}
        <Typography variant="caption" sx={{ display: "block" }}>
          {fDate(model.releaseDate)}
        </Typography>
      </TimelineOppositeContent>

      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor: color === "default" ? "text.disabled" : `${color}.main`,
          }}
        />
        <TimelineConnector />
      </TimelineSeparator>

      <TimelineContent sx={{ py: 1.5, px: 2 }}>
        <ButtonBase
          onClick={() => onToggle(model.id)}
          aria-expanded={expanded}
          sx={{
            width: 1,
            display: "block",
            textAlign: "left",
            borderRadius: 1.5,
            p: 1.5,
            border: `1px solid ${theme.vars.palette.divider}`,
            transition: theme.transitions.create([
              "border-color",
              "box-shadow",
            ]),
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", flexWrap: "wrap", mb: 0.5 }}
          >
            <Iconify
              width={22}
              icon={vendorIcon(model.vendor)}
              sx={brand ? undefined : { color: `${color}.main` }}
            />
            <Label variant="soft" color={color}>
              {model.vendor}
            </Label>
            <Typography variant="subtitle1">{model.name}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Iconify
              width={20}
              icon={expanded ? "eva:chevron-up-fill" : "eva:chevron-down-fill"}
              sx={{ color: "text.disabled" }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {model.highlight}
          </Typography>
        </ButtonBase>

        <Collapse in={expanded} unmountOnExit>
          <TimelineDetail model={model} />
        </Collapse>
      </TimelineContent>
    </TimelineItem>
  );
}
