"use client";

import { useState } from "react";
import { useAuthContext } from "src/auth/hooks";
import { setBotMock, setBotModel, useGetBotStatus } from "src/actions/admin";
import {
  Box,
  Card,
  Stack,
  Alert,
  Switch,
  Typography,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";

import { BotStatusPill } from "./bot-status-pill";
import { BotModelsHealth } from "./bot-models-health";
import { BotModelSelector } from "./bot-model-selector";

import type { ControlProviderName } from "./bot-types";

export function AdminBotView() {
  const { user } = useAuthContext();
  const accessToken = user?.accessToken;

  const { botStatus, botStatusLoading, botStatusMutate } =
    useGetBotStatus(accessToken);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAlive = botStatus?.isAlive ?? false;
  const disabled = !isAlive || busy;

  const handleSetModel = async (
    provider: ControlProviderName,
    model: string,
  ) => {
    setBusy(true);
    setError(null);
    try {
      await setBotModel(provider, model);
      await botStatusMutate();
    } catch {
      setError(
        "Не удалось переключить модель — бот отклонил выбор или недоступен.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleToggleMock = async (enabled: boolean) => {
    setBusy(true);
    setError(null);
    try {
      await setBotMock(enabled);
      await botStatusMutate();
    } catch {
      setError("Не удалось переключить режим mock.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        AI-бот
      </Typography>

      {botStatusLoading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={3}>
          <BotStatusPill status={botStatus} isAlive={isAlive} />

          {!isAlive && (
            <Alert severity="error">
              Бот не отвечает. Управление недоступно, пока он не вернётся в
              сеть.
            </Alert>
          )}

          {error && <Alert severity="warning">{error}</Alert>}

          <BotModelSelector
            accessToken={accessToken}
            activeModel={botStatus?.model}
            disabled={disabled}
            onSetModel={handleSetModel}
          />

          <Card sx={{ p: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={botStatus?.isMockEnabled ?? false}
                  disabled={disabled}
                  onChange={(e) => handleToggleMock(e.target.checked)}
                />
              }
              label="Режим «без LLM» (mock) — публиковать посты сырыми"
            />
          </Card>

          <BotModelsHealth accessToken={accessToken} />
        </Stack>
      )}
    </Box>
  );
}
