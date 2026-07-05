import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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

import { BENCHMARK_COLUMNS } from "./const";
import { formatUsd, formatBench } from "./utils";

import type { ComparableModel } from "./types";

// ----------------------------------------------------------------------

interface PinRowProps {
  label: string;
  value: string;
}

/** One metric line inside a pinned column. */
function PinRow({ label, value }: PinRowProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        py: 0.5,
        borderBottom: (t) => `1px dashed ${alpha(t.palette.grey[500], 0.16)}`,
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
  const color = vendorColor(model.vendor);

  return (
    <Box
      sx={{
        flex: "1 1 0",
        minWidth: 180,
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: "background.paper",
        border: (t) => `1px solid ${alpha(t.palette.grey[500], 0.16)}`,
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

      <PinRow label="Вход $/1M" value={formatUsd(model.pricing.inputPerM)} />
      <PinRow label="Выход $/1M" value={formatUsd(model.pricing.outputPerM)} />
      <PinRow label="Контекст" value={formatContext(model.contextTokens)} />
      {BENCHMARK_COLUMNS.map((col) => (
        <PinRow
          key={col.key}
          label={col.label}
          value={formatBench(model.benchmarks[col.key])}
        />
      ))}
    </Box>
  );
}
