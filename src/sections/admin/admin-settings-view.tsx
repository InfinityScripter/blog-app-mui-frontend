"use client";

import { useState } from "react";
import { useAuthContext } from "src/auth/hooks";
import { revalidatePublicPosts } from "src/actions/revalidate-posts";
import { setPdCollection, useGetAdminSettings } from "src/actions/settings";
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

export function AdminSettingsView() {
  const { authenticated } = useAuthContext();

  const { flags, flagsLoading, flagsMutate } =
    useGetAdminSettings(authenticated);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTogglePdCollection = async (enabled: boolean) => {
    setBusy(true);
    setError(null);
    try {
      await setPdCollection(enabled);
      await flagsMutate();
      // Flush the public ISR pages so the newsletter/sign-up UI appears or
      // disappears for anonymous visitors without waiting for the ISR window.
      // revalidatePublicPosts never throws — it returns false on failure — so
      // check it explicitly, else a failed flush is invisible and public pages
      // silently keep the stale flag until the ISR window elapses.
      const revalidated = await revalidatePublicPosts();
      if (!revalidated) {
        setError(
          "Флаг переключён, но кеш публичных страниц не обновился — изменение проявится по истечении ISR-окна.",
        );
      }
    } catch {
      setError("Не удалось переключить флаг. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Настройки
      </Typography>

      {flagsLoading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={3}>
          {error && <Alert severity="warning">{error}</Alert>}

          <Card sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <FormControlLabel
                control={
                  <Switch
                    checked={flags?.pdCollection ?? false}
                    disabled={busy}
                    onChange={(e) => handleTogglePdCollection(e.target.checked)}
                  />
                }
                label="Сбор персональных данных (регистрация, OAuth, рассылка)"
              />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Выключено — регистрация, вход через Google/Яндекс и подписка на
                рассылку недоступны (роуты отвечают 404), персональные данные не
                собираются. Включайте только если оформлено уведомление в
                Роскомнадзор по 152-ФЗ. Вход существующих пользователей и
                отписка работают всегда.
              </Typography>
            </Stack>
          </Card>
        </Stack>
      )}
    </Box>
  );
}
