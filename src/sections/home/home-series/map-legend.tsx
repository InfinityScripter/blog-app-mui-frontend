import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";

import type { LevelState } from "./types";

// ----------------------------------------------------------------------

type LegendKey = "legendPassed" | "legendCurrent" | "legendOpen" | "legendSoon";

const LEGEND: { state: LevelState; key: LegendKey }[] = [
  { state: "passed", key: "legendPassed" },
  { state: "current", key: "legendCurrent" },
  { state: "open", key: "legendOpen" },
  { state: "soon", key: "legendSoon" },
];

export function MapLegend() {
  const t = useTranslations("home.series");

  return (
    <Stack
      direction="row"
      spacing={2.5}
      useFlexGap
      sx={{ flexWrap: "wrap", mt: 2 }}
    >
      {LEGEND.map((item) => (
        <Stack
          key={item.state}
          direction="row"
          spacing={1}
          sx={{ alignItems: "center" }}
        >
          <Box component="span" className="ls-dot" data-state={item.state} />
          <Typography variant="caption">{t(item.key)}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}
