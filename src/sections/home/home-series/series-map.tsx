import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { LevelNode } from "./level-node";
import { MapLegend } from "./map-legend";
import { getLevelStates } from "./utils";
import { LevelDialog } from "./level-dialog";
import { SERIES_LESSONS } from "./data/lessons";
import { MAP_POINTS, MAP_CITY_SRC } from "./const";
import { useSeriesProgress } from "./hooks/use-series-progress";

import type { SeriesLesson } from "./types";

// ----------------------------------------------------------------------

export function HomeSeriesMap() {
  const t = useTranslations("home.series");
  const { passed, markPassed } = useSeriesProgress();
  const [selected, setSelected] = useState<SeriesLesson>();
  const [running, setRunning] = useState(false);

  const states = getLevelStates(SERIES_LESSONS, passed);
  const currentIndex = states.indexOf("current");
  const spritePoint =
    MAP_POINTS[currentIndex === -1 ? MAP_POINTS.length - 1 : currentIndex];

  return (
    <Container component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={1.5} sx={{ mb: 4, alignItems: "flex-start" }}>
        <Typography component="p" sx={monoLabelSx}>
          {t("overline")}
        </Typography>
        <Typography variant="h2" component="h2">
          {t("title")}
        </Typography>
        <Typography sx={{ color: "text.secondary", maxWidth: "65ch" }}>
          {t("subtitle")}
        </Typography>
        <Typography variant="subtitle2">
          {t("progress", {
            passed: passed.length,
            total: SERIES_LESSONS.length,
          })}
        </Typography>
      </Stack>

      <Box className="ls-map">
        <Box
          component="img"
          className="ls-map__city"
          src={MAP_CITY_SRC}
          alt=""
          loading="lazy"
        />
        <Box
          component="svg"
          className="ls-map__path"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polyline
            points={MAP_POINTS.map(
              (point) => `${point.left},${point.top}`,
            ).join(" ")}
          />
        </Box>
        {SERIES_LESSONS.map((lesson, index) => (
          <LevelNode
            key={lesson.number}
            lesson={lesson}
            state={states[index]}
            point={MAP_POINTS[index]}
            onOpen={setSelected}
          />
        ))}
        <Box
          component="span"
          className={running ? "ls-sprite ls-sprite--run" : "ls-sprite"}
          aria-hidden
          sx={{ left: `${spritePoint.left}%`, top: `${spritePoint.top}%` }}
        />
      </Box>

      <MapLegend />

      {selected && (
        <LevelDialog
          key={selected.number}
          lesson={selected}
          onClose={() => setSelected(undefined)}
          onComplete={(lessonNumber) => {
            setRunning(true);
            markPassed(lessonNumber);
          }}
        />
      )}
    </Container>
  );
}
