import type { CardProps } from "@mui/material/Card";
import type { TimelineItemProps } from "@mui/lab/TimelineItem";

import Card from "@mui/material/Card";
import Timeline from "@mui/lab/Timeline";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { fDateTime } from "src/utils/format-time";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";

// ----------------------------------------------------------------------

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  time: string | number | null;
}

interface AnalyticsOrderTimelineProps extends Omit<CardProps, "title"> {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  list: TimelineEvent[];
}

export function AnalyticsOrderTimeline({
  title,
  subheader,
  list,
  ...other
}: AnalyticsOrderTimelineProps) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Timeline
        sx={{
          m: 0,
          p: 3,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {list.map((item, index) => (
          <Item
            key={item.id}
            item={item}
            lastItem={index === list.length - 1}
          />
        ))}
      </Timeline>
    </Card>
  );
}

interface ItemProps extends TimelineItemProps {
  item: TimelineEvent;
  lastItem: boolean;
}

function Item({ item, lastItem, ...other }: ItemProps) {
  return (
    <TimelineItem {...other}>
      <TimelineSeparator>
        <TimelineDot
          color={
            (item.type === "order1" && "primary") ||
            (item.type === "order2" && "success") ||
            (item.type === "order3" && "info") ||
            (item.type === "order4" && "warning") ||
            "error"
          }
        />
        {lastItem ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{item.title}</Typography>

        <Typography variant="caption" sx={{ color: "text.disabled" }}>
          {fDateTime(item.time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
