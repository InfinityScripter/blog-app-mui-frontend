"use client";

import type { AutoPublishKey } from "src/actions/settings";

import { useState } from "react";
import { useAuthContext } from "src/auth/hooks";
import { revalidatePublicPosts } from "src/actions/revalidate-posts";
import {
  setAutoPublish,
  setPdCollection,
  useGetAdminSettings,
} from "src/actions/settings";
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

// The two auto-publish switches, rendered from data so the near-identical
// cards don't duplicate JSX. pdCollection is kept separate below because its
// toggle additionally flushes the public ISR cache — the auto-publish flags
// gate only the news bot, never public pages, so they skip that step.
const AUTO_PUBLISH_TOGGLES: {
  key: AutoPublishKey;
  label: string;
  hint: string;
}[] = [
  {
    key: "autoPublishReleases",
    label: "Автопубликация релизов моделей (changelog)",
    hint: "Включено — бот сам публикует найденные релизы AI-моделей в /changelog при прохождении гейта качества. Выключено — каждый релиз приходит карточкой в Telegram на ручной аппрув. Ничего не теряется.",
  },
  {
    key: "autoPublishNews",
    label: "Автопубликация новостей (блог)",
    hint: "Включено — бот сам публикует переписанные новости в блог и канал при прохождении гейта. Выключено — каждая новость приходит карточкой в Telegram на ручной аппрув. Ничего не теряется.",
  },
];

export function AdminSettingsView() {
  const { authenticated } = useAuthContext();

  const { flags, flagsLoading, flagsMutate } =
    useGetAdminSettings(authenticated);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shared toggle runner: flip a flag, refetch the snapshot, surface any error.
  // `after` runs an extra step (e.g. ISR flush) only when a flag needs it.
  const runToggle = async (
    action: () => Promise<void>,
    after?: () => Promise<void>,
  ) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      await flagsMutate();
      if (after) await after();
    } catch {
      setError("Не удалось переключить флаг. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  };

  const handleTogglePdCollection = (enabled: boolean) =>
    runToggle(
      () => setPdCollection(enabled),
      // Flush the public ISR pages so the newsletter/sign-up UI appears or
      // disappears for anonymous visitors without waiting for the ISR window.
      // revalidatePublicPosts never throws — it returns false on failure — so
      // check it explicitly, else a failed flush is invisible and public pages
      // silently keep the stale flag until the ISR window elapses.
      async () => {
        const revalidated = await revalidatePublicPosts();
        if (!revalidated) {
          setError(
            "Флаг переключён, но кеш публичных страниц не обновился — изменение проявится по истечении ISR-окна.",
          );
        }
      },
    );

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

          {AUTO_PUBLISH_TOGGLES.map(({ key, label, hint }) => (
            <Card key={key} sx={{ p: 3 }}>
              <Stack spacing={1.5}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={flags?.[key] ?? false}
                      disabled={busy}
                      onChange={(e) =>
                        runToggle(() => setAutoPublish(key, e.target.checked))
                      }
                    />
                  }
                  label={label}
                />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {hint}
                </Typography>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
