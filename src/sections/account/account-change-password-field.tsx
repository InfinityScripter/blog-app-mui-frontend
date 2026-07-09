import { Iconify } from "src/components/iconify";
import { Field } from "src/components/hook-form";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import type { PasswordFieldProps } from "./types";

// ----------------------------------------------------------------------

export function PasswordField({ name, label, visible }: PasswordFieldProps) {
  return (
    <Field.Text
      name={name}
      label={label}
      type={visible.value ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={visible.onToggle}
              edge="end"
              aria-label={visible.value ? "Скрыть пароль" : "Показать пароль"}
            >
              <Iconify
                icon={
                  visible.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                }
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
