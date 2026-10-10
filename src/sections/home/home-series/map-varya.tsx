import { useTranslations } from "next-intl";
import ButtonBase from "@mui/material/ButtonBase";

import { VARYA_BARKS } from "./const";

import type { MapPoint, VaryaPose } from "./types";

// ----------------------------------------------------------------------

interface MapVaryaProps {
  point: MapPoint;
  pose: VaryaPose;
  running: boolean;
  hops: number;
  onHop: () => void;
  onLand: () => void;
}

export function MapVarya({
  point,
  pose,
  running,
  hops,
  onHop,
  onLand,
}: MapVaryaProps) {
  const t = useTranslations("home.series");
  const bark = VARYA_BARKS[(hops - 1) % VARYA_BARKS.length];

  return (
    <ButtonBase
      className={running ? "ls-varya ls-varya--run" : "ls-varya"}
      aria-label={t("varyaLabel")}
      onClick={onHop}
      sx={{ left: `${point.left}%`, top: `${point.top}%` }}
    >
      <span
        key={hops}
        className="ls-varya__sprite"
        data-pose={pose}
        onAnimationEnd={pose === "jump" ? onLand : undefined}
      />
      {hops > 0 && (
        <span key={`bark-${hops}`} className="ls-varya__bark" aria-hidden>
          {t(`bark.${bark}`)}
        </span>
      )}
    </ButtonBase>
  );
}
