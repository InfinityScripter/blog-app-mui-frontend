"use client";

import { Box, Stack, Typography } from "@mui/material";

import type { BotModelProbe } from "./types";

type Props = {
  probe: BotModelProbe;
};

export function BotModelProbeRow({ probe }: Props) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        py: 1,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {probe.label}
        </Typography>
        <Typography
          variant="caption"
          noWrap
          sx={{
            color: "text.secondary",
          }}
        >
          {probe.model}
        </Typography>
        {!probe.ok && probe.error && (
          <Typography
            variant="caption"
            sx={{
              color: "error.main",
              display: "block",
            }}
          >
            {probe.error}
          </Typography>
        )}
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: probe.ok ? "success.main" : "error.main",
          }}
        >
          {probe.ok ? "✅ OK" : "❌ ошибка"}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
          }}
        >
          {probe.ms} мс
        </Typography>
      </Stack>
    </Stack>
  );
}
