"use client";

import Button from "@mui/material/Button";
import { Iconify } from "src/components/iconify";
import { useFinancePrivacy } from "src/sections/finance/finance-privacy";

export function FinancePrivacyToggle() {
  const { hidden, toggle } = useFinancePrivacy();

  return (
    <Button
      size="small"
      color="inherit"
      variant="outlined"
      onClick={toggle}
      sx={{ flexShrink: 0 }}
      startIcon={
        <Iconify icon={hidden ? "solar:eye-bold" : "solar:eye-closed-bold"} />
      }
    >
      {hidden ? "Показать данные" : "Скрыть данные"}
    </Button>
  );
}
