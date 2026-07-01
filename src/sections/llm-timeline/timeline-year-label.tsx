import Chip from "@mui/material/Chip";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

// ----------------------------------------------------------------------

interface TimelineYearLabelProps {
  year: number;
}

/**
 * A year divider on the axis: a chip marking the start of each year's models.
 * The opposite content is kept empty so the chip aligns with the entries below.
 */
export function TimelineYearLabel({ year }: TimelineYearLabelProps) {
  return (
    <TimelineItem>
      <TimelineOppositeContent sx={{ flex: 0.2 }} />
      <TimelineSeparator>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ py: 1.5, px: 2 }}>
        <Chip label={year} color="primary" size="small" variant="soft" />
      </TimelineContent>
    </TimelineItem>
  );
}
