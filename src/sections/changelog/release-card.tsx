import type { ModelRelease } from "src/types/api";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { maxLine } from "src/theme/styles";
import { Label } from "src/components/label";
import { fDate } from "src/utils/format-time";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";

import { vendorColor, formatPrice, formatContext } from "./utils";

// ----------------------------------------------------------------------

interface ReleaseCardProps {
  release: ModelRelease;
}

/**
 * A single row in the /changelog archive: vendor chip + «model version» heading
 * + released date, with price/context chips when known. Links to the detail
 * page. Styling mirrors the news feed card (theme colors via Label, no hex).
 */
export function ReleaseCard({ release }: ReleaseCardProps) {
  const theme = useTheme();
  const linkTo = paths.changelog.details(release.slug);
  const title = `${release.model} ${release.version}`.trim();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        py: 2,
        borderTop: `1px solid ${theme.vars.palette.divider}`,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ flexWrap: "wrap", alignItems: "center" }}
      >
        <Label variant="soft" color={vendorColor(release.vendor)}>
          {release.vendor}
        </Label>
        {release.releasedAt && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {fDate(release.releasedAt)}
          </Typography>
        )}
      </Stack>

      <Link
        component={RouterLink}
        href={linkTo}
        color="text.primary"
        sx={{
          typography: "h6",
          ...maxLine({ line: 2, persistent: theme.typography.h6 }),
          transition: theme.transitions.create("color"),
          "&:hover": { color: "primary.main" },
        }}
      >
        {title}
      </Link>

      <Stack
        direction="row"
        spacing={2}
        sx={{ flexWrap: "wrap", color: "text.secondary" }}
      >
        <Typography variant="caption">
          Контекст: {formatContext(release.contextTokens)}
        </Typography>
        <Typography variant="caption">
          Вход: {formatPrice(release.priceIn)} / 1M
        </Typography>
        <Typography variant="caption">
          Выход: {formatPrice(release.priceOut)} / 1M
        </Typography>
      </Stack>
    </Box>
  );
}
