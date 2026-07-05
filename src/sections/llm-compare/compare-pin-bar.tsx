"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { alpha } from "@mui/material/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import { ComparePinColumn } from "./compare-pin-column";

import type { ComparableModel } from "./types";

// ----------------------------------------------------------------------

interface ComparePinBarProps {
  models: ComparableModel[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onShare: () => void;
  /** True right after a successful copy — flips the share button label. */
  shared: boolean;
}

/**
 * Sticky bottom bar showing the pinned models side-by-side for a focused
 * head-to-head. «Поделиться» copies the current URL (pins live in `?pin=`), so
 * a specific comparison is shareable. Renders nothing when nothing is pinned.
 */
export function ComparePinBar({
  models,
  onRemove,
  onClear,
  onShare,
  shared,
}: ComparePinBarProps) {
  const t = useTranslations("llmCompare");

  if (!models.length) return null;

  return (
    <Paper
      elevation={8}
      sx={{
        position: "sticky",
        bottom: 16,
        mt: 4,
        p: 2,
        zIndex: 5,
        borderRadius: 2,
        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
        backdropFilter: "blur(6px)",
        bgcolor: (theme) => alpha(theme.palette.background.default, 0.9),
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Typography variant="subtitle1">
          {t("pinBar.title", { count: models.length })}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            color={shared ? "success" : "primary"}
            onClick={onShare}
            startIcon={
              <Iconify
                icon={shared ? "solar:check-circle-bold" : "solar:share-bold"}
              />
            }
          >
            {shared ? t("pinBar.copied") : t("pinBar.share")}
          </Button>
          <Button
            size="small"
            color="inherit"
            onClick={onClear}
            startIcon={<Iconify icon="solar:trash-bin-trash-linear" />}
          >
            {t("pinBar.clear")}
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          overflowX: "auto",
          pb: 0.5,
          scrollbarWidth: "thin",
        }}
      >
        {models.map((model) => (
          <ComparePinColumn key={model.id} model={model} onRemove={onRemove} />
        ))}
      </Box>
    </Paper>
  );
}
