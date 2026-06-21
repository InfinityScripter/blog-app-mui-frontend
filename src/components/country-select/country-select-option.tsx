import type { Key, HTMLAttributes } from "react";

import { FlagIcon } from "src/components/iconify";

import { getCountry } from "./utils";

import type { CountryOption } from "./types";

// ----------------------------------------------------------------------

export function CountrySelectOption(
  props: HTMLAttributes<HTMLLIElement> & { key: Key },
  option: CountryOption,
) {
  const country = getCountry(option);

  if (!country.label) {
    return null;
  }

  return (
    <li {...props} key={country.label}>
      <FlagIcon
        key={country.label}
        code={country.code}
        sx={{ mr: 1, width: 22, height: 22, borderRadius: "50%" }}
      />
      {country.label} ({country.code}) +{country.phone}
    </li>
  );
}
