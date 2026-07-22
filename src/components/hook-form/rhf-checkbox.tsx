import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, useFormContext } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";

import type { RHFCheckboxProps, RHFMultiCheckboxProps } from "./types";

// ----------------------------------------------------------------------

export function RHFCheckbox({
  name,
  helperText,
  label,
  slotProps,
  ...other
}: RHFCheckboxProps) {
  const { control } = useFormContext();

  const ariaLabel = `Checkbox ${name}`;
  const helperTextId = `${name}-helper-text`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const hasHelperText = !!error || !!helperText;
        const describedBy = [
          slotProps?.checkbox?.inputProps?.["aria-describedby"],
          hasHelperText ? helperTextId : undefined,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <Box sx={slotProps?.wrap}>
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  {...slotProps?.checkbox}
                  inputProps={{
                    ...(!label && { "aria-label": ariaLabel }),
                    ...slotProps?.checkbox?.inputProps,
                    "aria-describedby": describedBy || undefined,
                    "aria-invalid": !!error || undefined,
                  }}
                />
              }
              label={label}
              {...other}
            />

            {hasHelperText && (
              <FormHelperText
                id={helperTextId}
                error={!!error}
                {...slotProps?.formHelperText}
              >
                {error ? error?.message : helperText}
              </FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMultiCheckbox({
  name,
  label,
  options,
  slotProps,
  helperText,
  ...other
}: RHFMultiCheckboxProps) {
  const { control } = useFormContext();

  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  const accessibility = (val: string) => val;
  const ariaLabel = (val: string) => `Checkbox ${val}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" sx={slotProps?.wrap}>
          {label && (
            <FormLabel
              component="legend"
              {...slotProps?.formLabel}
              sx={{ mb: 1, typography: "body2", ...slotProps?.formLabel?.sx }}
            >
              {label}
            </FormLabel>
          )}

          <FormGroup {...other}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onChange={() =>
                      field.onChange(getSelected(field.value, option.value))
                    }
                    name={accessibility(option.label)}
                    {...slotProps?.checkbox}
                    inputProps={{
                      ...(!option.label && {
                        "aria-label": ariaLabel(option.label),
                      }),
                      ...slotProps?.checkbox?.inputProps,
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>

          {(!!error || helperText) && (
            <FormHelperText
              error={!!error}
              sx={{ mx: 0 }}
              {...slotProps?.formHelperText}
            >
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
