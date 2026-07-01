import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
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
          Контекст: {formatContext(model.contextTokens)}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Параметры: {formatParams(model.params)}
        </Typography>
      </Stack>

      {model.capabilities.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {model.capabilities.map((cap) => (
            <Chip key={cap} label={cap} size="small" variant="soft" />
          ))}
        </Stack>
      )}

      {model.sourceUrl && (
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ alignItems: "center", mt: 1.5 }}
        >
          <Iconify width={18} icon="solar:link-bold-duotone" />
          <Link
            href={model.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
          >
            Источник
          </Link>
        </Stack>
      )}
    </Box>
  );
}
