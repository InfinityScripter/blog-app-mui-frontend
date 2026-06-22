"use client";

import { useGetBotModelsHealth } from "src/actions/admin";
import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";

import { BotModelProbeRow } from "./bot-model-probe-row";

type Props = {
  accessToken?: string;
};

export function BotModelsHealth({ accessToken }: Props) {
  const {
    botModelsHealth,
    botModelsHealthLoading,
    botModelsHealthError,
    botModelsHealthMutate,
  } = useGetBotModelsHealth(accessToken);

  const checks = botModelsHealth?.checks ?? [];
  const hasData = botModelsHealth !== null;

  return (
    <Card sx={{ p: 3 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="h6">Проверка моделей</Typography>
          {hasData && (
            <Chip
              size="small"
              color={botModelsHealth.healthy ? "success" : "error"}
              label={
                botModelsHealth.healthy ? "Все модели OK" : "Есть проблемы"
              }
            />
          )}
        </Stack>
        <Button
          variant="outlined"
          size="small"
          disabled={botModelsHealthLoading}
          onClick={() => botModelsHealthMutate()}
        >
          Проверить
        </Button>
      </Stack>

      {botModelsHealthError && (
        <Typography variant="body2" color="error.main">
          Не удалось получить статус моделей.
        </Typography>
      )}

      {botModelsHealthLoading && !hasData ? (
        <Box sx={{ py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Stack divider={<Divider flexItem />}>
          {checks.length === 0 && !botModelsHealthError ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              Нет данных. Нажмите «Проверить».
            </Typography>
          ) : (
            checks.map((probe) => (
              <BotModelProbeRow
                key={`${probe.provider}-${probe.model}`}
                probe={probe}
              />
            ))
          )}
        </Stack>
      )}
    </Card>
  );
}
