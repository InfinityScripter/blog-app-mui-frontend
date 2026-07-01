"use client";

import Timeline from "@mui/lab/Timeline";
import { useMemo, Fragment } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { timelineItemClasses } from "@mui/lab/TimelineItem";

import { groupByYear } from "../utils";
import { TimelineEntry } from "../timeline-entry";
import { TimelineYearLabel } from "../timeline-year-label";
import { useTimelineSelection } from "../hooks/use-timeline-selection";

import type { LlmTimelineViewProps } from "./types";

// ----------------------------------------------------------------------

/**
 * The /llm-timeline page: a vertical, year-grouped timeline of landmark LLMs
 * from oldest to newest. Clicking a model expands its detail panel inline
 * (accordion — one open at a time via {@link useTimelineSelection}).
 */
export function LlmTimelineView({ models }: LlmTimelineViewProps) {
  const groups = useMemo(() => groupByYear(models), [models]);
  const { isSelected, toggle } = useTimelineSelection();

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        История больших языковых моделей
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: { xs: 3, md: 5 } }}>
        Хронология ключевых LLM от старых к новым. Нажмите на модель, чтобы увидеть подробности.
      </Typography>

      {groups.length > 0 ? (
        <Timeline
          position="right"
          sx={{
            p: 0,
            [`& .${timelineItemClasses.root}:before`]: { flex: 0, p: 0 },
          }}
        >
          {groups.map((group) => (
            <Fragment key={group.year}>
              <TimelineYearLabel year={group.year} />
              {group.models.map((model) => (
                <TimelineEntry
                  key={model.id}
                  model={model}
                  expanded={isSelected(model.id)}
                  onToggle={toggle}
                />
              ))}
            </Fragment>
          ))}
        </Timeline>
      ) : (
        <Typography
          variant="body2"
          sx={{ py: 6, textAlign: "center", color: "text.disabled" }}
        >
          Пока нет моделей.
        </Typography>
      )}
    </Container>
  );
}
