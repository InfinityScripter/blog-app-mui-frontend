import Box from "@mui/material/Box";
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

import { vendorColor } from "./utils";
import { TimelineDetail } from "./timeline-detail";

import type { LlmModel } from "./types";

// ----------------------------------------------------------------------

interface TimelineEntryProps {
  model: LlmModel;
  expanded: boolean;
  onToggle: (id: string) => void;
}

/**
 * One model on the vertical axis: a colored dot, the opposite-side date, and a
 * clickable card (vendor Label + name + highlight) that expands the detail
 * panel inline. Card is a ButtonBase for keyboard/aria correctness.
 */
export function TimelineEntry({ model, expanded, onToggle }: TimelineEntryProps) {
  const theme = useTheme();
  const color = vendorColor(model.vendor);

  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{ flex: 0.2, m: "auto 0", color: "text.disabled" }}
        align="right"
        variant="caption"
      >
        {fDate(model.releaseDate)}
      </TimelineOppositeContent>

      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor:
              color === "default"
                ? "text.disabled"
                : `${color}.main`,
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
            transition: theme.transitions.create(["border-color", "box-shadow"]),
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", flexWrap: "wrap", mb: 0.5 }}
          >
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
