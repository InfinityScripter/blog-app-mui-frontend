import { useMemo } from "react";
import Table from "@mui/material/Table";
import Tooltip from "@mui/material/Tooltip";
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

interface SortableCol {
  key: SortKey;
  label: string;
  hint?: string;
  numeric: boolean;
}

const LEADING_COLS: SortableCol[] = [
  { key: "priceIn", label: "Вход $/1M", numeric: true },
  { key: "priceOut", label: "Выход $/1M", numeric: true },
  { key: "context", label: "Контекст", numeric: true },
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
            <TableCell sx={{ minWidth: 200 }}>Модель</TableCell>

            {LEADING_COLS.map((col) => (
              <TableCell key={col.key} align="right">
                <TableSortLabel
                  active={sortKey === col.key}
                  direction={sortKey === col.key ? sortDir : "asc"}
                  onClick={() => onSort(col.key)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}

            {benchColumns.map((col) => (
              <TableCell key={col.key} align="right">
                <Tooltip title={col.hint} arrow placement="top">
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
              Сравнить
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
