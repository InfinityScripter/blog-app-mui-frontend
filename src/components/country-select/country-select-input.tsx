import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { filledInputClasses } from "@mui/material/FilledInput";
import { FlagIcon, iconifyClasses } from "src/components/iconify";

import { getCountry } from "./utils";

import type { CountrySelectInputProps } from "./types";

// ----------------------------------------------------------------------

export function CountrySelectInput({
  params,
  label,
  placeholder,
  helperText,
  hiddenLabel,
  error,
  multiple,
}: CountrySelectInputProps) {
  const inputValue =
    typeof params.inputProps.value === "string" ? params.inputProps.value : "";
  const country = getCountry(inputValue);

  const baseField = {
    ...params,
    label,
    placeholder,
    helperText,
    hiddenLabel,
    error: !!error,
    inputProps: {
      ...params.inputProps,
      autoComplete: "new-password",
    },
  };

  if (multiple) {
    return <TextField {...baseField} />;
  }

  return (
    <TextField
      {...baseField}
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{ ...(!country.code && { display: "none" }) }}
          >
            <FlagIcon
              key={country.label}
              code={country.code}
              sx={{
                ml: 0.5,
                mr: -0.5,
                width: 22,
                height: 22,
                borderRadius: "50%",
              }}
            />
          </InputAdornment>
        ),
      }}
      sx={{
        ...(!hiddenLabel && {
          [`& .${filledInputClasses.root}`]: {
            [`& .${iconifyClasses.root}`]: { mt: -2 },
          },
        }),
      }}
    />
  );
}
