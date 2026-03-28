import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

export function FaqsForm() {
  return (
    <div>
      <Typography variant="h4">Не нашли нужный ответ?</Typography>

      <Typography sx={{ mt: 2, mb: 4, color: "text.secondary" }}>
        Напишите напрямую в соцсети — так быстрее обсудим задачу и контекст.
      </Typography>

      <Stack spacing={2}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          href="https://t.me/sh0ny/"
          target="_blank"
          rel="noopener"
          startIcon={<Iconify icon="ri:telegram-fill" />}
        >
          Написать в Telegram
        </Button>

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1.5}>
          <Button
            variant="outlined"
            href="https://github.com/InfinityScripter"
            target="_blank"
            rel="noopener"
            startIcon={<Iconify icon="akar-icons:github-fill" />}
          >
            GitHub
          </Button>

          <Button
            variant="outlined"
            href="https://vk.com/sh0ny"
            target="_blank"
            rel="noopener"
            startIcon={<Iconify icon="ri:vk-fill" />}
          >
            VK
          </Button>
        </Box>
      </Stack>
    </div>
  );
}
