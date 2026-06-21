import type { MouseEvent } from "react";
import type { Country } from "react-phone-number-input";
import type { countries } from "src/assets/data/countries";
import type { TextFieldProps } from "@mui/material/TextField";
import type { Props as PhoneNumberInputProps } from "react-phone-number-input/input";

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

export interface CountryListPopoverProps {
  countryCode?: Country;
  onClickCountry: (countryCode: Country) => void;
}

export type CountryOption = (typeof countries)[number];

export interface ApplyFilterParams {
  inputData: readonly CountryOption[];
  query: string;
}

export interface CountryListButtonProps {
  code?: string;
  onOpen: (event: MouseEvent) => void;
}

export interface CountryListProps {
  countryCode?: Country;
  dataFiltered: readonly CountryOption[];
  onSelectCountry: (countryCode: Country) => void;
}
