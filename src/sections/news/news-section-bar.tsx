import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { NEWS_CATEGORIES } from "./const";

// ----------------------------------------------------------------------

/**
 * Newspaper-style section header: «Новости» title with the рубрика list, under a
 * thick bottom rule. Рубрики are display-only labels for now (no filtering yet).
 */
export function NewsSectionBar() {
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
        spacing={2}
        sx={{
          flexWrap: "wrap",
          color: "text.secondary",
          typography: "body2",
        }}
      >
        {NEWS_CATEGORIES.map((category) => (
          <Box key={category} component="span">
            {category}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
