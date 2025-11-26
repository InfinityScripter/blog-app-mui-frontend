import { Controller, useFormContext, type FieldPath, type FieldValues } from "react-hook-form";

import TextField, { type TextFieldProps } from "@mui/material/TextField";

// ----------------------------------------------------------------------

interface RHFTextFieldProps<TFieldValues extends FieldValues = FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: FieldPath<TFieldValues>;
  helperText?: string;
  type?: string;
}

export function RHFTextField<TFieldValues extends FieldValues = FieldValues>({ name, helperText, type, ...other }: RHFTextFieldProps<TFieldValues>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
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
