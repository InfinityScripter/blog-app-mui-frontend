import type { ReactNode, ComponentType, SyntheticEvent } from "react";
import type { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";

import type { RHFAutocompleteProps } from "./types";

// ----------------------------------------------------------------------

// View MUI `Autocomplete` through the subset of props used here, leaving
// `options` (supplied via `...other`) optional so the wrapper type-checks.
interface AutocompleteViewProps {
  id?: string;
  value?: unknown;
  onChange?: (event: SyntheticEvent, newValue: unknown) => void;
  renderInput: (params: AutocompleteRenderInputParams) => ReactNode;
  options?: readonly unknown[];
  [key: string]: unknown;
}

const TypedAutocomplete = Autocomplete as ComponentType<AutocompleteViewProps>;

export function RHFAutocomplete({
  name,
  label,
  helperText,
  hiddenLabel,
  placeholder,
  ...other
}: RHFAutocompleteProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TypedAutocomplete
          {...field}
          id={`rhf-autocomplete-${name}`}
          onChange={(event, newValue) =>
            setValue(name, newValue, { shouldValidate: true })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error?.message : helperText}
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password",
              }}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
