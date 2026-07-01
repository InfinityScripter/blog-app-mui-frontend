"use client";

import { useMemo } from "react";
import Timeline from "@mui/lab/Timeline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { withYearMarkers } from "../utils";
import { TimelineEntry } from "../timeline-entry";
import { useTimelineSelection } from "../hooks/use-timeline-selection";

import type { LlmTimelineViewProps } from "./types";

// ----------------------------------------------------------------------

/**
 * The /llm-timeline page: a vertical timeline of landmark LLMs from oldest to
 * newest, alternating left/right (`position="alternate"`). A year chip marks
 * each year boundary on the opposite side. Clicking a model expands its detail
 * panel inline (accordion — one open at a time via {@link useTimelineSelection}).
 */
export function LlmTimelineView({ models }: LlmTimelineViewProps) {
  const rows = useMemo(() => withYearMarkers(models), [models]);
  const { isSelected, toggle } = useTimelineSelection();

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        История больших языковых моделей
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: { xs: 3, md: 5 } }}
      >
        Хронология ключевых LLM от старых к новым. Нажмите на модель, чтобы
        увидеть подробности.
      </Typography>

      {rows.length > 0 ? (
        <Timeline position="alternate" sx={{ p: 0 }}>
          {rows.map(({ model, yearStart }) => (
            <TimelineEntry
              key={model.id}
              model={model}
              yearStart={yearStart}
              expanded={isSelected(model.id)}
              onToggle={toggle}
            />
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
