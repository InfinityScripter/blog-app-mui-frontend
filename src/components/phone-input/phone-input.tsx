import type { Country } from "react-phone-number-input";

import { useState, forwardRef } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import PhoneNumberInput from "react-phone-number-input/input";

import { getCountryCode } from "./utils";
import { CountryListPopover } from "./list";
import { CustomInput } from "./custom-input";

import type { PhoneInputProps } from "./types";

// ----------------------------------------------------------------------

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
