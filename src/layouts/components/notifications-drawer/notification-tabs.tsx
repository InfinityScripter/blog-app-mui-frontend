import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { varAlpha } from "src/theme/styles";
import ButtonBase from "@mui/material/ButtonBase";
import { hairline, monoValueSx } from "src/theme/styles/editorial";

import { TABS } from "./const";

import type { NotificationTabsProps } from "./types";

// ----------------------------------------------------------------------

export function NotificationTabs({
  value,
  counts,
  onChange,
}: NotificationTabsProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ px: 2.5, pb: 2, borderBottom: (theme) => hairline(theme) }}
    >
      {TABS.map((tab) => {
        const selected = tab.value === value;

        return (
          <ButtonBase
            key={tab.value}
            onClick={() => onChange(tab.value)}
            aria-pressed={selected}
            sx={{
              px: 1.5,
              py: 0.75,
              gap: 0.75,
              borderRadius: 1,
              typography: "subtitle2",
              transition: (theme) =>
                theme.transitions.create(["background-color", "color"]),
              ...(selected
                ? { color: "background.paper", bgcolor: "text.primary" }
                : {
                    color: "text.secondary",
                    bgcolor: (theme) =>
                      varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
                    "&:hover": {
                      bgcolor: (theme) =>
                        varAlpha(theme.vars.palette.grey["500Channel"], 0.16),
                    },
                  }),
            }}
          >
            {tab.label}

            <Box
              component="span"
              sx={{ ...monoValueSx, fontSize: 12, opacity: 0.64 }}
            >
              {counts[tab.value]}
            </Box>
          </ButtonBase>
        );
      })}
    </Stack>
  );
}
