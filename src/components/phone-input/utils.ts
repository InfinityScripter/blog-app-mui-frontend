import type { Country } from "react-phone-number-input";

import { countries } from "src/assets/data/countries";
import { parsePhoneNumber } from "react-phone-number-input";

import type { CountryOption, ApplyFilterParams } from "./types";

// ----------------------------------------------------------------------

export type { CountryOption } from "./types";

// ----------------------------------------------------------------------

export function getCountryCode(
  inputValue?: string,
  countryCode?: Country,
): Country {
  if (inputValue) {
    const phoneNumber = parsePhoneNumber(inputValue);

    if (phoneNumber?.country) {
      return phoneNumber.country;
    }
  }

  return countryCode ?? "US";
}

// ----------------------------------------------------------------------

export function getCountry(countryCode?: string): CountryOption | undefined {
  const option = countries.filter((country) => country.code === countryCode)[0];
  return option;
}

export function applyFilter({
  inputData,
  query,
}: ApplyFilterParams): readonly CountryOption[] {
  if (query) {
    return inputData.filter(
      (country) =>
        country.label.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        country.code.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        country.phone.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }

  return inputData;
}
