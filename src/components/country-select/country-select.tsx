import { countries } from "src/assets/data";
import Autocomplete from "@mui/material/Autocomplete";

import { displayValueByCountryCode } from "./utils";
import { CountrySelectTags } from "./country-select-tags";
import { CountrySelectInput } from "./country-select-input";
import { CountrySelectOption } from "./country-select-option";

import type { CountryOption, CountrySelectProps } from "./types";

// ----------------------------------------------------------------------

export function CountrySelect({
  id,
  label,
  error,
  multiple,
  helperText,
  hiddenLabel,
  placeholder,
  getValue = "label",
  ...other
}: CountrySelectProps) {
  const options = countries.map((country) =>
    getValue === "label" ? country.label : country.code,
  );

  const getOptionLabel = (option: CountryOption) =>
    getValue === "label" ? option : displayValueByCountryCode(option);

  return (
    <Autocomplete
      id={`country-select-${id}`}
      multiple={multiple}
      options={options}
      autoHighlight={!multiple}
      disableCloseOnSelect={multiple}
      renderOption={CountrySelectOption}
      renderInput={(params) => (
        <CountrySelectInput
          params={params}
          label={label}
          placeholder={placeholder}
          helperText={helperText}
          hiddenLabel={hiddenLabel}
          error={error}
          multiple={multiple}
        />
      )}
      renderTags={multiple ? CountrySelectTags : undefined}
      getOptionLabel={getOptionLabel}
      {...other}
    />
  );
}
