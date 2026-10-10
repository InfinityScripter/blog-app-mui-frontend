import { useState } from "react";
import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { MapVarya } from "./map-varya";
import { LevelNode } from "./level-node";
import { MapLegend } from "./map-legend";
import { LevelDialog } from "./level-dialog";
import { SERIES_LESSONS } from "./data/lessons";
import { useMapTilt } from "./hooks/use-map-tilt";
import { MAP_POINTS, MAP_CITY_SRC } from "./const";
import { useVaryaHop } from "./hooks/use-varya-hop";
import { varyaPose, getLevelStates } from "./utils";
import { SeriesMapHeading } from "./series-map-heading";
import { useSeriesProgress } from "./hooks/use-series-progress";

import type { SeriesLesson } from "./types";

// ----------------------------------------------------------------------

export function HomeSeriesMap() {
  const { passed, markPassed } = useSeriesProgress();
  const [selected, setSelected] = useState<SeriesLesson>();
  const [running, setRunning] = useState(false);
  const varya = useVaryaHop();
  const tilt = useMapTilt();

  const states = getLevelStates(SERIES_LESSONS, passed);
  const currentIndex = states.indexOf("current");
  const finished = currentIndex === -1;
  const spritePoint =
    MAP_POINTS[finished ? MAP_POINTS.length - 1 : currentIndex];

  return (
    <Box component="section" className="ls-night dark ls-grain">
      <span className="ls-night__ghost" aria-hidden>
        {SERIES_LESSONS.length}
      </span>
      <Container sx={{ position: "relative" }}>
        <SeriesMapHeading passed={passed.length} />

        <m.div
          ref={tilt.ref}
          style={{
            rotateX: tilt.rotateX,
            scale: tilt.scale,
            transformPerspective: 1400,
            transformOrigin: "50% 100%",
          }}
        >
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
            <MapVarya
              point={spritePoint}
              pose={varyaPose({ hopping: varya.hopping, finished })}
              running={running}
              hops={varya.hops}
              onHop={varya.hop}
              onLand={varya.land}
            />
          </Box>
        </m.div>

        <MapLegend />
      </Container>

      {selected && (
        <LevelDialog
          key={selected.number}
          lesson={selected}
          onClose={() => setSelected(undefined)}
          onComplete={(lessonNumber) => {
            setRunning(true);
            markPassed(lessonNumber);
            varya.hop();
          }}
        />
      )}
    </Box>
  );
}
