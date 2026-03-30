import TextField, { type TextFieldProps } from "@mui/material/TextField";
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

// ----------------------------------------------------------------------

interface RHFTextFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<TextFieldProps, "name"> {
  name: FieldPath<TFieldValues>;
  helperText?: string;
  type?: string;
}

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
