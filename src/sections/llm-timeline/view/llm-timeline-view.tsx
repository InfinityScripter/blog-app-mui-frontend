"use client";

import Timeline from "@mui/lab/Timeline";
import { useMemo, useCallback } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useResponsive } from "src/hooks/use-responsive";
import { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";

import { YearNav } from "../year-nav";
import { TimelineHero } from "../timeline-hero";
import { TimelineEntry } from "../timeline-entry";
import { useYearSpy } from "../hooks/use-year-spy";
import { TimelineFilters } from "../timeline-filters";
import { useVendorFilter } from "../hooks/use-vendor-filter";
import { useTimelineSelection } from "../hooks/use-timeline-selection";
import {
  vendorStats,
  yearAnchorId,
  timelineYears,
  filterByVendors,
  withYearMarkers,
} from "../utils";

import type { LlmTimelineViewProps } from "./types";

// ----------------------------------------------------------------------

/**
 * The /llm-timeline page: hero with key metrics, vendor filter, sticky year
 * nav with scrollspy, and the vertical timeline itself — alternating L/R on
 * desktop, left-aligned with a narrow date rail on mobile. The decorative
 * floating-logo backdrop is provided site-wide by MainLayout.
 */
export function LlmTimelineView({ models }: LlmTimelineViewProps) {
  const mdUp = useResponsive("up", "md");

  const { selected, hasFilter, isActive, toggleVendor, clear } =
    useVendorFilter();
  const { isSelected, toggle } = useTimelineSelection();

  const stats = useMemo(() => vendorStats(models), [models]);
  const filtered = useMemo(
    () => filterByVendors(models, selected),
    [models, selected],
  );
  const rows = useMemo(() => withYearMarkers(filtered), [filtered]);
  const years = useMemo(() => timelineYears(filtered), [filtered]);
  const activeYear = useYearSpy(years);

  const handleJump = useCallback((year: number) => {
    document
      .getElementById(yearAnchorId(year))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <Container
      maxWidth="md"
      sx={{ py: { xs: 5, md: 8 }, position: "relative", zIndex: 1 }}
    >
      <TimelineHero models={models} />

      <TimelineFilters
        stats={stats}
        hasFilter={hasFilter}
        isActive={isActive}
        onToggle={toggleVendor}
        onClear={clear}
      />

      <YearNav years={years} activeYear={activeYear} onJump={handleJump} />

      {rows.length > 0 ? (
        <Timeline
          position={mdUp ? "alternate" : "right"}
          sx={{
            p: 0,
            ...(!mdUp && {
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: "0 0 auto",
                width: 96,
                px: 1,
              },
            }),
          }}
        >
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
          Нет моделей под выбранный фильтр.
        </Typography>
      )}
    </Container>
  );
}
