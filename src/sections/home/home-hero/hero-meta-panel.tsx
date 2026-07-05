import type { Theme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { hairline, monoLabelSx } from "src/theme/styles";

import { MInview } from "./m-inview";
import { HERO_PANEL_LINKS } from "./const";

// ----------------------------------------------------------------------

// «Оглавление журнала»: тихая панель-индекс со ссылками на разделы.
export function HeroMetaPanel() {
  const t = useTranslations("home");

  return (
    <MInview>
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2.5,
          bgcolor: "background.paper",
          border: (theme: Theme) => hairline(theme),
        }}
      >
        <Typography component="p" sx={{ ...monoLabelSx, mb: 1.5 }}>
          {t("hero.panel.title")}
        </Typography>

        <Typography variant="body2" sx={{ mb: 2.5, color: "text.secondary" }}>
          {t("hero.panel.description")}
        </Typography>

        <Stack>
          {HERO_PANEL_LINKS.map((item) => (
            <Link
              key={item.href}
              component={RouterLink}
              href={item.href}
              underline="none"
              color="inherit"
              sx={{
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: (theme: Theme) => hairline(theme),
                transition: (theme: Theme) =>
                  theme.transitions.create("color", {
                    duration: theme.transitions.duration.shorter,
                  }),
                "&:hover": { color: "primary.main" },
              }}
            >
              <Typography component="span" variant="subtitle2">
                {t(`hero.panel.links.${item.key}`)}
              </Typography>
              <Iconify width={16} icon="eva:arrow-ios-forward-fill" />
            </Link>
          ))}
        </Stack>
      </Box>
    </MInview>
  );
}
