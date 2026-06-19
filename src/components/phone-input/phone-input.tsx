import type { Ref } from "react";
import type { Country } from "react-phone-number-input";
import type { TextFieldProps } from "@mui/material/TextField";
import type { Props as PhoneNumberInputProps } from "react-phone-number-input/input";

import { useState, forwardRef } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import PhoneNumberInput from "react-phone-number-input/input";

import { getCountryCode } from "./utils";
import { CountryListPopover } from "./list";

// ----------------------------------------------------------------------

export interface PhoneInputProps
  extends Omit<
    PhoneNumberInputProps<TextFieldProps>,
    "value" | "onChange" | "country"
  > {
  value?: string;
  onChange?: (newValue?: string) => void;
  country?: Country;
  disableSelect?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      placeholder,
      country: inputCountryCode,
      disableSelect,
      ...other
    },
    ref,
  ) => {
    const defaultCountryCode = getCountryCode(value, inputCountryCode);

    const [selectedCountry, setSelectedCountry] =
      useState<Country>(defaultCountryCode);

    return (
      <PhoneNumberInput
        ref={ref}
        country={selectedCountry}
        inputComponent={CustomInput}
        value={value}
        onChange={(newValue) => onChange?.(newValue)}
        placeholder={placeholder ?? "Enter phone number"}
        InputProps={
          disableSelect
            ? undefined
            : {
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 1 }}>
                    <CountryListPopover
                      countryCode={selectedCountry}
                      onClickCountry={(inputValue) =>
                        setSelectedCountry(inputValue)
                      }
                    />
                  </InputAdornment>
                ),
              }
        }
        {...other}
      />
    );
  },
);

// ----------------------------------------------------------------------

const CustomInput = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ ...props }, ref: Ref<HTMLInputElement>) => (
    <TextField inputRef={ref} {...props} />
  ),
);
