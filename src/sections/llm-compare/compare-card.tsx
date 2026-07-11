"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useTranslations } from "next-intl";
import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  vendorIcon,
  vendorColor,
  hasBrandIcon,
  formatContext,
} from "src/sections/llm-timeline/utils";

import { BENCHMARK_COLUMNS } from "./const";
import { formatUsd, formatBench } from "./utils";

import type { ComparableModel } from "./types";

// ----------------------------------------------------------------------

interface StatProps {
  label: string;
  value: string;
}

/** One label/value pair in the card's stat grid. */
function Stat({ label, value }: StatProps) {
  return (
    <Box sx={{ minWidth: 72 }}>
      <Typography
        variant="caption"
        sx={{ color: "text.disabled", display: "block" }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

interface CompareCardProps {
  model: ComparableModel;
  pinned: boolean;
  pinDisabled: boolean;
  onTogglePin: (id: string) => void;
}

/** Mobile stacked card — same data as a table row, laid out vertically. */
export function CompareCard({
  model,
  pinned,
  pinDisabled,
  onTogglePin,
}: CompareCardProps) {
  const t = useTranslations("llmCompare");
  const color = vendorColor(model.vendor);

  return (
    <Card variant="outlined" sx={{ p: 2, mb: 1.5 }}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Iconify
          width={24}
          icon={vendorIcon(model.vendor)}
          sx={
            hasBrandIcon(model.vendor) ? undefined : { color: `${color}.main` }
          }
        />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Link
            href={model.sourceUrl}
            target="_blank"
            rel="noopener"
            color="inherit"
            underline="hover"
            sx={{ fontWeight: 700 }}
          >
            {model.name}
            <Iconify
              icon="eva:external-link-fill"
              width={12}
              sx={{ ml: 0.5, verticalAlign: "-1px", color: "text.disabled" }}
            />
          </Link>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ mt: 0.25 }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {model.vendor}
            </Typography>
            {model.openWeights && (
              <Label variant="soft" color="success">
                {t("labels.openWeights")}
              </Label>
            )}
          </Stack>
        </Box>
        <IconButton
          size="small"
          color={pinned ? "primary" : "default"}
          disabled={pinDisabled}
          onClick={() => onTogglePin(model.id)}
        >
          <Iconify
            width={20}
            icon={pinned ? "solar:pin-bold" : "solar:pin-linear"}
          />
        </IconButton>
      </Stack>

      <Typography variant="body2" sx={{ color: "text.secondary", my: 1.5 }}>
        {model.highlight}
      </Typography>

      <Divider sx={{ mb: 1.5 }} />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Stat
          label={t("columns.priceIn")}
          value={formatUsd(model.pricing.inputPerM)}
        />
        <Stat
          label={t("columns.priceOut")}
          value={formatUsd(model.pricing.outputPerM)}
        />
        <Stat
          label={t("columns.context")}
          value={formatContext(model.contextTokens)}
        />
        {BENCHMARK_COLUMNS.map((col) => (
          <Stat
            key={col.key}
            label={col.label}
            value={formatBench(model.benchmarks[col.key])}
          />
        ))}
      </Box>
    </Card>
  );
}
