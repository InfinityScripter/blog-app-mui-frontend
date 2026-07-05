"use client";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

interface CompareEmptyProps {
  onReset: () => void;
}

/** Zero-results state when filters exclude every model. Offers a reset. */
export function CompareEmpty({ onReset }: CompareEmptyProps) {
  const t = useTranslations("llmCompare");

  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}
    >
      <Iconify
        width={48}
        icon="solar:filter-broken"
        sx={{ color: "text.disabled" }}
      />
      <Typography variant="h6">{t("empty.title")}</Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", maxWidth: 420 }}
      >
        {t("empty.description")}
      </Typography>
      <Button
        variant="outlined"
        onClick={onReset}
        startIcon={<Iconify icon="solar:restart-bold-duotone" />}
      >
        {t("empty.reset")}
      </Button>
    </Stack>
  );
}
