"use client";

import { useState } from "react";
import { useAuthContext } from "src/auth/hooks";
import {
  setBotMock,
  setBotModel,
  useGetBotStatus,
  useGetBotModels,
  useGetBotProviders,
} from "src/actions/admin";
import {
  Box,
  Card,
  Chip,
  Stack,
  Alert,
  Switch,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";

import {
  getHealthColor,
  formatModelLabel,
  toControlProvider,
} from "./bot-utils";

import type { ControlProviderName } from "./bot-types";

export function AdminBotView() {
  const { user } = useAuthContext();
  const accessToken = user?.accessToken;

  const { botStatus, botStatusLoading, botStatusMutate } =
    useGetBotStatus(accessToken);
  const { botProviders } = useGetBotProviders(accessToken);

  const [provider, setProvider] = useState<ControlProviderName | null>(null);
  const { botModels } = useGetBotModels(provider, accessToken);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAlive = botStatus?.isAlive ?? false;
  const disabled = !isAlive || busy;

  const handleSetModel = async (model: string) => {
    if (!provider) return;
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
          <Card sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={isAlive ? "Бот в сети" : "Бот недоступен"}
                color={getHealthColor(isAlive)}
                size="small"
              />
              {isAlive && (
                <Typography variant="body2" color="text.secondary">
                  Активная модель: <b>{botStatus?.provider}</b> /{" "}
                  {botStatus?.model}
                  {botStatus?.isMockEnabled ? " · режим без LLM" : ""}
                </Typography>
              )}
            </Stack>
          </Card>

          {!isAlive && (
            <Alert severity="error">
              Бот не отвечает. Управление недоступно, пока он не вернётся в
              сеть.
            </Alert>
          )}

          {error && <Alert severity="warning">{error}</Alert>}

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Модель переработки
            </Typography>
            <Stack spacing={2}>
              <FormControl fullWidth disabled={disabled}>
                <InputLabel>Провайдер</InputLabel>
                <Select
                  label="Провайдер"
                  value={provider ?? ""}
                  onChange={(e) => {
                    const next = toControlProvider(e.target.value);
                    if (next) setProvider(next);
                  }}
                >
                  {botProviders.map((p) => (
                    <MenuItem
                      key={p.name}
                      value={p.name}
                      disabled={!p.hasKey && p.name !== "mock"}
                    >
                      {p.label}
                      {!p.hasKey && p.name !== "mock" ? " — нет ключа" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {provider && provider !== "mock" && (
                <FormControl fullWidth disabled={disabled}>
                  <InputLabel>Модель</InputLabel>
                  <Select
                    label="Модель"
                    value={botStatus?.model ?? ""}
                    onChange={(e) => handleSetModel(e.target.value)}
                  >
                    {botModels.length === 0 ? (
                      <MenuItem disabled value="">
                        нет доступных моделей
                      </MenuItem>
                    ) : (
                      botModels.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                          {formatModelLabel(m)}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              )}

              {provider === "mock" && (
                <Alert severity="info">Посты уходят без переработки LLM.</Alert>
              )}
            </Stack>
          </Card>

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
        </Stack>
      )}
    </Box>
  );
}
