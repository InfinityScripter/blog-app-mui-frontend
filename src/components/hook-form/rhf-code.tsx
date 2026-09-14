import { MuiOtpInput } from "mui-one-time-password-input";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, useFormContext } from "react-hook-form";

import type { RHFCodeProps } from "./types";

// ----------------------------------------------------------------------

export function RHFCode({ name, ...other }: RHFCodeProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <MuiOtpInput
            {...field}
            autoFocus
            length={6}
            TextFieldsProps={{ error: !!error, placeholder: "-" }}
            sx={{ gap: 1.5 }}
            {...other}
          />

          {error && (
            <FormHelperText sx={{ px: 2 }} error>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
