"use client";

import { Card, Chip, Stack, Typography } from "@mui/material";

import { getHealthColor } from "./utils";

import type { BotStatus } from "./types";

type Props = {
  status: BotStatus | null;
  isAlive: boolean;
};

export function BotStatusPill({ status, isAlive }: Props) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip
          label={isAlive ? "Бот в сети" : "Бот недоступен"}
          color={getHealthColor(isAlive)}
          size="small"
        />
        {isAlive && (
          <Typography variant="body2" color="text.secondary">
            Активная модель: <b>{status?.provider}</b> / {status?.model}
            {status?.isMockEnabled ? " · режим без LLM" : ""}
          </Typography>
        )}
      </Stack>
    </Card>
  );
}
