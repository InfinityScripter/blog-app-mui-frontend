import type { ModelRelease } from "src/types/api";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { useTranslations } from "next-intl";
import { Label } from "src/components/label";
import { fDate } from "src/utils/format-time";
import { useTheme } from "@mui/material/styles";
import { RouterLink } from "src/routes/components";
import { maxLine, monoValueSx } from "src/theme/styles";

import {
  vendorColor,
  formatPrice,
  formatContext,
  isFreshRelease,
} from "./utils";

// ----------------------------------------------------------------------

interface ReleaseCardProps {
  release: ModelRelease;
}

/**
 * Строка леджера /changelog: mono-дата слева, контент справа (vendor-лейбл,
 * заголовок «model version», mono-спеки). Свежий релиз (≤7 дней) получает
 * пульсирующую vermilion-точку — единственная постоянная микро-анимация.
 */
export function ReleaseCard({ release }: ReleaseCardProps) {
  const theme = useTheme();
  const t = useTranslations("changelog");
  const linkTo = paths.changelog.details(release.slug);
  const title = `${release.model} ${release.version}`.trim();
  const fresh = isFreshRelease(release.releasedAt);

  return (
    <Box
      sx={{
        py: 2.5,
        gap: { xs: 1, sm: 3 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        borderTop: `1px solid ${theme.vars.palette.divider}`,
      }}
    >
      <Box
        sx={{
          ...monoValueSx,
          pt: 0.25,
          flexShrink: 0,
          width: { sm: 128 },
          color: "text.disabled",
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {fresh && (
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "primary.main",
              animation: "releasePulse 2s ease-in-out infinite",
              "@keyframes releasePulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.35 },
              },
            }}
          />
        )}
        {release.releasedAt ? fDate(release.releasedAt) : "—"}
      </Box>

      <Stack spacing={1} sx={{ minWidth: 0, flexGrow: 1 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: "wrap", alignItems: "center" }}
        >
          <Label variant="outlined" color={vendorColor(release.vendor)}>
            {release.vendor}
          </Label>
        </Stack>

        <Link
          component={RouterLink}
          href={linkTo}
          color="text.primary"
          underline="none"
          sx={{
            typography: "h5",
            ...maxLine({ line: 2, persistent: theme.typography.h5 }),
            transition: theme.transitions.create("color"),
            "&:hover": { color: "primary.main" },
          }}
        >
          {title}
        </Link>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            ...monoValueSx,
            fontSize: 12,
            flexWrap: "wrap",
            color: "text.secondary",
          }}
        >
          <Box component="span">
            {t("card.context", { value: formatContext(release.contextTokens) })}
          </Box>
          <Box component="span">
            {t("card.input", { value: formatPrice(release.priceIn) })}
          </Box>
          <Box component="span">
            {t("card.output", { value: formatPrice(release.priceOut) })}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
