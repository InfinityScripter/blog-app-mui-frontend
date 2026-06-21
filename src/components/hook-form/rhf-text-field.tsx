import TextField from "@mui/material/TextField";
import { Controller, useFormContext, type FieldValues } from "react-hook-form";

import type { RHFTextFieldProps } from "./types";

// ----------------------------------------------------------------------

export function RHFTextField<TFieldValues extends FieldValues = FieldValues>({
  name,
  helperText,
  type,
  id,
  ...other
}: RHFTextFieldProps<TFieldValues>) {
  const { control } = useFormContext();
  const stableId = id ?? `rhf-${String(name).replace(/\./g, "-")}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          id={stableId}
          fullWidth
          type={type}
          value={type === "number" && field.value === 0 ? "" : field.value}
          onChange={(event) => {
            if (type === "number") {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          inputProps={{
            autoComplete: "off",
          }}
          {...other}
        />
      )}
    />
  );
}
