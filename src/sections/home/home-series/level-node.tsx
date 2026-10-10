import { useTranslations } from "next-intl";
import ButtonBase from "@mui/material/ButtonBase";
import { useAppLocale } from "src/hooks/use-app-locale";

import type { MapPoint, LevelState, SeriesLesson } from "./types";

// ----------------------------------------------------------------------

interface LevelNodeProps {
  lesson: SeriesLesson;
  state: LevelState;
  point: MapPoint;
  onOpen: (lesson: SeriesLesson) => void;
}

export function LevelNode({ lesson, state, point, onOpen }: LevelNodeProps) {
  const t = useTranslations("home.series");
  const locale = useAppLocale();
  const label = `${t("level", { number: lesson.number })}: ${lesson.title[locale]}`;

  return (
    <ButtonBase
      className="ls-node"
      data-state={state}
      title={lesson.title[locale]}
      aria-label={state === "soon" ? `${label}, ${t("legendSoon")}` : label}
      onClick={() => onOpen(lesson)}
      sx={{ left: `${point.left}%`, top: `${point.top}%` }}
    >
      {lesson.number}
    </ButtonBase>
  );
}
