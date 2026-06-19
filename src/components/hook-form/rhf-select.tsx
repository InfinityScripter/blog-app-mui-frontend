import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, useFormContext } from "react-hook-form";

import type { FieldOption, RHFSelectProps, RHFMultiSelectProps } from "./types";

// ----------------------------------------------------------------------

export function RHFSelect({
  name,
  native,
  children,
  slotProps,
  helperText,
  inputProps,
  InputLabelProps,
  ...other
}: RHFSelectProps) {
  const { control } = useFormContext();

  const labelId = `${name}-select-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{
            native,
            MenuProps: {
              PaperProps: { sx: { maxHeight: 220, ...slotProps?.paper } },
            },
            sx: { textTransform: "capitalize" },
          }}
          InputLabelProps={{ htmlFor: labelId, ...InputLabelProps }}
          inputProps={{ id: labelId, ...inputProps }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMultiSelect({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  slotProps,
  helperText,
  ...other
}: RHFMultiSelectProps) {
  const { control } = useFormContext<Record<string, FieldOption["value"][]>>();

  const labelId = `${name}-select-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { value: fieldValue, ...fieldRest } = field;
        const value: FieldOption["value"][] = Array.isArray(fieldValue)
          ? fieldValue.filter(
              (item): item is FieldOption["value"] => typeof item === "string",
            )
          : [];

        return (
          <FormControl error={!!error} {...other}>
            {label && (
              <InputLabel htmlFor={labelId} {...slotProps?.inputLabel}>
                {label}
              </InputLabel>
            )}

            <Select<FieldOption["value"][]>
              {...fieldRest}
              value={value}
              multiple
              displayEmpty={!!placeholder}
              label={label}
              renderValue={(selected) => {
                const selectedItems = options.filter((item: FieldOption) =>
                  selected.includes(item.value),
                );

                if (!selectedItems.length && placeholder) {
                  return (
                    <Box sx={{ color: "text.disabled" }}>{placeholder}</Box>
                  );
                }

                if (chip) {
                  return (
                    <Box sx={{ gap: 0.5, display: "flex", flexWrap: "wrap" }}>
                      {selectedItems.map((item: FieldOption) => (
                        <Chip
                          key={item.value}
                          size="small"
                          variant="soft"
                          label={item.label}
                          {...slotProps?.chip}
                        />
                      ))}
                    </Box>
                  );
                }

                return selectedItems
                  .map((item: FieldOption) => item.label)
                  .join(", ");
              }}
              {...slotProps?.select}
              inputProps={{ id: labelId, ...slotProps?.select?.inputProps }}
            >
              {options.map((option: FieldOption) => (
                <MenuItem key={option.value} value={option.value}>
                  {checkbox && (
                    <Checkbox
                      size="small"
                      disableRipple
                      checked={value.includes(option.value)}
                      {...slotProps?.checkbox}
                    />
                  )}

                  {option.label}
                </MenuItem>
              ))}
            </Select>

            {(!!error || helperText) && (
              <FormHelperText error={!!error} {...slotProps?.formHelperText}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
}
