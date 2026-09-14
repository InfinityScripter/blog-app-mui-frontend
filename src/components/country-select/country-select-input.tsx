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
  const htmlInputValue = params.slotProps.htmlInput.value;
  const inputValue = typeof htmlInputValue === "string" ? htmlInputValue : "";
  const country = getCountry(inputValue);

  const baseField = {
    ...params,
    label,
    placeholder,
    helperText,
    hiddenLabel,
    error: !!error,
    slotProps: {
      ...params.slotProps,
      htmlInput: {
        ...params.slotProps.htmlInput,
        autoComplete: "new-password",
      },
    },
  };

  if (multiple) {
    return <TextField {...baseField} />;
  }

  return (
    <TextField
      {...baseField}
      slotProps={{
        ...params.slotProps,
        htmlInput: {
          ...params.slotProps.htmlInput,
          autoComplete: "new-password",
        },
        input: {
          ...params.slotProps.input,
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
        },
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
