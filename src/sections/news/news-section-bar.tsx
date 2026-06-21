import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import type { NewsSectionBarProps } from "./types";

// ----------------------------------------------------------------------

/**
 * Newspaper-style section header: «Новости» title with the рубрика list, under a
 * thick bottom rule. Each рубрика is a clickable filter; the active one is
 * highlighted. Presentational only — selection state lives in the view.
 */
export function NewsSectionBar({
  categories,
  active,
  onSelect,
}: NewsSectionBarProps) {
  return (
    <Box
      sx={{
        pb: 1,
        mb: { xs: 3, md: 4 },
        borderBottom: (theme) => `2px solid ${theme.vars.palette.text.primary}`,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Typography variant="h3" component="h1">
        Новости
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: "wrap",
          typography: "body2",
        }}
      >
        {categories.map((category) => {
          const selected = category === active;
          return (
            <Box
              key={category}
              component="button"
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(category)}
              sx={{
                appearance: "none",
                cursor: "pointer",
                border: "none",
                font: "inherit",
                px: 1.25,
                py: 0.5,
                borderRadius: 1,
                transition: (theme) =>
                  theme.transitions.create(["background-color", "color"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                color: selected ? "primary.contrastText" : "text.secondary",
                bgcolor: selected ? "primary.main" : "transparent",
                fontWeight: (theme) =>
                  selected
                    ? theme.typography.fontWeightSemiBold
                    : theme.typography.fontWeightMedium,
                "&:hover": {
                  color: selected ? "primary.contrastText" : "text.primary",
                  bgcolor: (theme) =>
                    selected
                      ? theme.vars.palette.primary.dark
                      : alpha(theme.palette.text.primary, 0.08),
                },
                "&:focus-visible": {
                  outline: (theme) =>
                    `2px solid ${theme.vars.palette.primary.main}`,
                  outlineOffset: 2,
                },
              }}
            >
              {category}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
