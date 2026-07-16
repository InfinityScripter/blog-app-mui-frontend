"use client";

import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { alpha } from "@mui/material/styles";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  vendorIcon,
  vendorColor,
  hasBrandIcon,
  formatContext,
} from "src/sections/llm-timeline/utils";

import { formatUsd } from "./utils";
import { BenchValue } from "./bench-value";
import { BENCHMARK_COLUMNS } from "./const";

import type { ComparableModel } from "./types";

// ----------------------------------------------------------------------

interface PinRowProps {
  label: string;
  value: ReactNode;
}

/** One metric line inside a pinned column. */
function PinRow({ label, value }: PinRowProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        py: 0.5,
        borderBottom: (theme) =>
          `1px dashed ${alpha(theme.palette.grey[500], 0.16)}`,
      }}
    >
      <Typography variant="caption" sx={{ color: "text.disabled" }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Stack>
  );
}

interface ComparePinColumnProps {
  model: ComparableModel;
  onRemove: (id: string) => void;
}

/** A single pinned model rendered as a labelled column for the head-to-head. */
export function ComparePinColumn({ model, onRemove }: ComparePinColumnProps) {
  const t = useTranslations("llmCompare");
  const color = vendorColor(model.vendor);

  return (
    <Box
      sx={{
        flex: "1 1 0",
        minWidth: 180,
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: "background.paper",
        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Iconify
          width={18}
          icon={vendorIcon(model.vendor)}
          sx={
            hasBrandIcon(model.vendor) ? undefined : { color: `${color}.main` }
          }
        />
        <Typography
          variant="subtitle2"
          sx={{ flexGrow: 1, minWidth: 0 }}
          noWrap
        >
          {model.name}
        </Typography>
        <IconButton size="small" onClick={() => onRemove(model.id)}>
          <Iconify width={16} icon="mingcute:close-line" />
        </IconButton>
      </Stack>

      <PinRow
        label={t("columns.priceIn")}
        value={formatUsd(model.pricing.inputPerM)}
      />
      <PinRow
        label={t("columns.priceOut")}
        value={formatUsd(model.pricing.outputPerM)}
      />
      <PinRow
        label={t("columns.context")}
        value={formatContext(model.contextTokens)}
      />
      {BENCHMARK_COLUMNS.map((col) => (
        <PinRow
          key={col.key}
          label={col.label}
          value={<BenchValue score={model.benchmarks[col.key]} />}
        />
      ))}
    </Box>
  );
}
