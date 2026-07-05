"use client";

import { useMemo } from "react";
import Table from "@mui/material/Table";
import Tooltip from "@mui/material/Tooltip";
import { useTranslations } from "next-intl";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableSortLabel from "@mui/material/TableSortLabel";

import { bestInColumn } from "./utils";
import { BENCHMARK_COLUMNS } from "./const";
import { CompareTableRow } from "./compare-table-row";

import type { ComparableModel } from "./types";
import type { SortKey, SortDir } from "./const";

// ----------------------------------------------------------------------

// Static config for the leading (non-benchmark) sortable columns: stable sort
// `key` + the `columns.<labelKey>` translation key. Labels resolve per-locale
// in the component so this stays a plain data list (no `t()` at module scope).
interface LeadingCol {
  key: SortKey;
  labelKey: "priceIn" | "priceOut" | "context";
}

const LEADING_COLS: LeadingCol[] = [
  { key: "priceIn", labelKey: "priceIn" },
  { key: "priceOut", labelKey: "priceOut" },
  { key: "context", labelKey: "context" },
];

interface CompareTableProps {
  models: ComparableModel[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  isPinned: (id: string) => boolean;
  isPinFull: boolean;
  onTogglePin: (id: string) => void;
}

/**
 * Desktop comparison table. Headers are click-to-sort ({@link TableSortLabel});
 * for every numeric column the best value across the *currently shown* set is
 * highlighted in each row (computed here so header order and highlight stay in
 * lockstep). Horizontally scrollable so wide benchmark columns never clip.
 */
export function CompareTable({
  models,
  sortKey,
  sortDir,
  onSort,
  isPinned,
  isPinFull,
  onTogglePin,
}: CompareTableProps) {
  const t = useTranslations("llmCompare");
  const benchColumns = BENCHMARK_COLUMNS;

  // Best-in-column across the shown set — one pass, reused by every row.
  const bests = useMemo(() => {
    const keys: SortKey[] = [
      "priceIn",
      "priceOut",
      "context",
      ...benchColumns.map((col) => col.sortKey),
    ];
    return keys.reduce<Partial<Record<SortKey, number | null>>>((acc, key) => {
      acc[key] = bestInColumn(models, key);
      return acc;
    }, {});
  }, [models, benchColumns]);

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 200 }}>{t("columns.model")}</TableCell>

            {LEADING_COLS.map((col) => (
              <TableCell key={col.key} align="right">
                <TableSortLabel
                  active={sortKey === col.key}
                  direction={sortKey === col.key ? sortDir : "asc"}
                  onClick={() => onSort(col.key)}
                >
                  {t(`columns.${col.labelKey}`)}
                </TableSortLabel>
              </TableCell>
            ))}

            {benchColumns.map((col) => (
              <TableCell key={col.key} align="right">
                <Tooltip
                  title={t(`benchmarks.${col.key}.hint`)}
                  arrow
                  placement="top"
                >
                  <TableSortLabel
                    active={sortKey === col.sortKey}
                    direction={sortKey === col.sortKey ? sortDir : "asc"}
                    onClick={() => onSort(col.sortKey)}
                  >
                    {col.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ))}

            <TableCell align="center" sx={{ minWidth: 64 }}>
              {t("columns.compare")}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {models.map((model) => (
            <CompareTableRow
              key={model.id}
              model={model}
              bests={bests}
              pinned={isPinned(model.id)}
              pinDisabled={isPinFull && !isPinned(model.id)}
              onTogglePin={onTogglePin}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
