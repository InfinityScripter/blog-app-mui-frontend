import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { varAlpha } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import { formatParams, formatContext } from "./utils";

import type { LlmModel } from "./types";

// ----------------------------------------------------------------------

interface TimelineDetailProps {
  model: LlmModel;
}

/**
 * Expanded panel for one model: description, context/params facts, capability
 * chips and a source link. Rendered inside a Collapse by {@link TimelineEntry}.
 * Colors come from the theme (no hex) so light/dark stays predictable.
 */
export function TimelineDetail({ model }: TimelineDetailProps) {
  const theme = useTheme();
  const t = useTranslations("llmTimeline");

  return (
    <Box
      sx={{
        mt: 1.5,
        p: 2,
        borderRadius: 1.5,
        bgcolor: "background.neutral",
      }}
    >
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
        {model.description}
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{ flexWrap: "wrap", mb: model.capabilities.length ? 1.5 : 0 }}
      >
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {t("detail.context")}: {formatContext(model.contextTokens)}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {t("detail.params")}: {formatParams(model.params)}
        </Typography>
      </Stack>

      {model.capabilities.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {model.capabilities.map((cap) => (
            <Chip key={cap} label={cap} size="small" variant="soft" />
          ))}
        </Stack>
      )}

      {model.funFact && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: 1.5,
            alignItems: "flex-start",
            bgcolor: varAlpha(theme.vars.palette.warning.mainChannel, 0.08),
          }}
        >
          <Iconify
            width={18}
            icon="solar:lightbulb-bolt-bold-duotone"
            sx={{ mt: 0.25, color: "warning.main", flexShrink: 0 }}
          />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {model.funFact}
          </Typography>
        </Stack>
      )}

      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: "center", mt: 1.5, flexWrap: "wrap" }}
      >
        {model.sourceUrl && (
          <Link
            href={model.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
          >
            <Iconify width={18} icon="solar:link-bold-duotone" />
            {t("detail.announcement")}
          </Link>
        )}
        {model.wikiUrl && (
          <Link
            href={model.wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
          >
            <Iconify width={18} icon="mdi:wikipedia" />
            {t("detail.wikipedia")}
          </Link>
        )}
      </Stack>
    </Box>
  );
}
