import Stack from "@mui/material/Stack";
import { varAlpha } from "src/theme/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import type { NotificationEmptyProps } from "./types";

// ----------------------------------------------------------------------

const CONTENT = {
  error: {
    icon: "solar:danger-triangle-bold-duotone",
    title: "Не удалось загрузить",
    description: "Проверьте соединение и обновите страницу",
  },
  all: {
    icon: "solar:bell-off-bold-duotone",
    title: "Пока нет уведомлений",
    description: "Новые публикации и релизы моделей появятся здесь",
  },
  unread: {
    icon: "solar:check-circle-bold-duotone",
    title: "Всё прочитано",
    description: "Новых уведомлений нет",
  },
  archived: {
    icon: "solar:archive-minimalistic-bold-duotone",
    title: "Архив пуст",
    description: "Архивируйте уведомления, чтобы скрыть их из ленты",
  },
};

export function NotificationEmpty({ tab, hasError }: NotificationEmptyProps) {
  const content = hasError ? CONTENT.error : CONTENT[tab];

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ flexGrow: 1, px: 4, py: 10, textAlign: "center" }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          color: "text.disabled",
          bgcolor: (theme) =>
            varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
        }}
      >
        <Iconify icon={content.icon} width={30} />
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="subtitle1">{content.title}</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {content.description}
        </Typography>
      </Stack>
    </Stack>
  );
}
