"use client";

import { useState } from "react";
import { useGetBotModels, useGetBotProviders } from "src/actions/admin";
import {
  Card,
  Stack,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";

import { formatModelLabel, toControlProvider } from "./bot-utils";

import type { ControlProviderName } from "./bot-types";

type Props = {
  accessToken?: string;
  activeModel?: string;
  disabled: boolean;
  onSetModel: (provider: ControlProviderName, model: string) => void;
};

export function BotModelSelector({
  accessToken,
  activeModel,
  disabled,
  onSetModel,
}: Props) {
  const { botProviders } = useGetBotProviders(accessToken);
  const [provider, setProvider] = useState<ControlProviderName | null>(null);
  const { botModels } = useGetBotModels(provider, accessToken);

  return (
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
              <MenuItem key={p.name} value={p.name} disabled={!p.hasKey}>
                {p.label}
                {!p.hasKey ? " — нет ключа" : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {provider && (
          <FormControl fullWidth disabled={disabled}>
            <InputLabel>Модель</InputLabel>
            <Select
              label="Модель"
              value={activeModel ?? ""}
              onChange={(e) => onSetModel(provider, e.target.value)}
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
      </Stack>
    </Card>
  );
}
