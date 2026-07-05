import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import { TABS } from "./const";

import type { LibraryTab } from "./types";

// ----------------------------------------------------------------------

interface LibraryHeroProps {
  tab: LibraryTab;
  onTabChange: (tab: LibraryTab) => void;
}

/** Hub header: eyebrow, title, intent line, and the section tab switcher. */
export function LibraryHero({ tab, onTabChange }: LibraryHeroProps) {
  const t = useTranslations("library");

  return (
    <Stack spacing={1.5} sx={{ mb: { xs: 2, md: 3 } }}>
      <Typography component="p" sx={monoLabelSx}>
        {t("hero.eyebrow")}
      </Typography>
      <Typography variant="h2" component="h1">
        {t("hero.title")}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", maxWidth: 720 }}
      >
        {t("hero.subtitle")}
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, value: LibraryTab) => onTabChange(value)}
        sx={{ mt: 1 }}
      >
        {TABS.map((def) => (
          <Tab
            key={def.value}
            value={def.value}
            label={t(`tabs.${def.value}`)}
            iconPosition="start"
            icon={<Iconify width={20} icon={def.icon} />}
          />
        ))}
      </Tabs>
    </Stack>
  );
}
