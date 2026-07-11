"use client";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useTranslations } from "next-intl";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  vendorIcon,
  vendorColor,
  hasBrandIcon,
  formatContext,
} from "src/sections/llm-timeline/utils";

import { MAX_PINS, BENCHMARK_COLUMNS } from "./const";
import { formatUsd, formatBench, isColumnLeader } from "./utils";

import type { SortKey } from "./const";
import type { ComparableModel } from "./types";

// ----------------------------------------------------------------------

/** sx applied to the winning cell in each numeric column. */
const LEADER_SX = { fontWeight: 700, color: "success.main" } as const;

interface CompareTableRowProps {
  model: ComparableModel;
  bests: Partial<Record<SortKey, number | null>>;
  pinned: boolean;
  pinDisabled: boolean;
  onTogglePin: (id: string) => void;
}

/** One model row in the desktop matrix. Winning cells are tinted per column. */
export function CompareTableRow({
  model,
  bests,
  pinned,
  pinDisabled,
  onTogglePin,
}: CompareTableRowProps) {
  const t = useTranslations("llmCompare");
  const color = vendorColor(model.vendor);
  const leaderSx = (key: SortKey) =>
    isColumnLeader(model, key, bests[key]) ? LEADER_SX : undefined;

  return (
    <TableRow hover selected={pinned}>
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify
            width={20}
            icon={vendorIcon(model.vendor)}
            sx={
              hasBrandIcon(model.vendor)
                ? undefined
                : { color: `${color}.main` }
            }
          />
          <Stack spacing={0}>
            <Tooltip title={t("labels.sourceTooltip")} arrow placement="top">
              <Link
                href={model.sourceUrl}
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                sx={{ fontWeight: 600, fontSize: 14 }}
              >
                {model.name}
                <Iconify
                  icon="eva:external-link-fill"
                  width={12}
                  sx={{
                    ml: 0.5,
                    verticalAlign: "-1px",
                    color: "text.disabled",
                  }}
                />
              </Link>
            </Tooltip>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              {model.vendor}
              {model.openWeights ? ` ${t("labels.openWeightsSuffix")}` : ""}
            </Typography>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell align="right" sx={leaderSx("priceIn")}>
        {formatUsd(model.pricing.inputPerM)}
      </TableCell>
      <TableCell align="right" sx={leaderSx("priceOut")}>
        {formatUsd(model.pricing.outputPerM)}
      </TableCell>
      <TableCell align="right" sx={leaderSx("context")}>
        {formatContext(model.contextTokens)}
      </TableCell>

      {BENCHMARK_COLUMNS.map((col) => (
        <TableCell key={col.key} align="right" sx={leaderSx(col.sortKey)}>
          {formatBench(model.benchmarks[col.key])}
        </TableCell>
      ))}

      <TableCell align="center">
        <Tooltip
          title={
            pinned
              ? t("actions.unpin")
              : pinDisabled
                ? t("actions.pinMax", { max: MAX_PINS })
                : t("actions.pin")
          }
          arrow
        >
          <span>
            <IconButton
              size="small"
              color={pinned ? "primary" : "default"}
              disabled={pinDisabled}
              onClick={() => onTogglePin(model.id)}
            >
              <Iconify
                width={18}
                icon={pinned ? "solar:pin-bold" : "solar:pin-linear"}
              />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
