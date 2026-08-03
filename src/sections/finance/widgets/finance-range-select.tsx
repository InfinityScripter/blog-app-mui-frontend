"use client";

import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { ymLabel } from "src/sections/finance/utils";

interface Props {
  months: string[];
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

export function FinanceRangeSelect({ months, from, to, onChange }: Props) {
  return (
    <Stack direction="row" spacing={2}>
      <TextField
        select
        size="small"
        label="С месяца"
        value={from}
        sx={{ minWidth: 140 }}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next, to < next ? next : to);
        }}
      >
        {months.map((ym) => (
          <MenuItem key={ym} value={ym}>
            {ymLabel(ym)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        size="small"
        label="По месяц"
        value={to}
        sx={{ minWidth: 140 }}
        onChange={(event) => {
          const next = event.target.value;
          onChange(from > next ? next : from, next);
        }}
      >
        {months.map((ym) => (
          <MenuItem key={ym} value={ym}>
            {ymLabel(ym)}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
