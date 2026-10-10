import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";

import { LEVEL_STATE_LABEL_KEY } from "./const";

// ----------------------------------------------------------------------

export function MapLegend() {
  const t = useTranslations("home.series");

  return (
    <Stack
      direction="row"
      spacing={2.5}
      useFlexGap
      sx={{ flexWrap: "wrap", mt: 2 }}
    >
      {Object.entries(LEVEL_STATE_LABEL_KEY).map(([state, key]) => (
        <Stack
          key={state}
          direction="row"
          spacing={1}
          sx={{ alignItems: "center" }}
        >
          <Box component="span" className="ls-dot" data-state={state} />
          <Typography variant="caption">{t(key)}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}
