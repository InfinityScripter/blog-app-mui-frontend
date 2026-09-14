import type {
  AutocompleteOwnerState,
  AutocompleteRenderValueGetItemProps,
} from "@mui/material/Autocomplete";

import Chip from "@mui/material/Chip";
import { FlagIcon } from "src/components/iconify";

import { getCountry } from "./utils";

import type { CountryOption } from "./types";

// ----------------------------------------------------------------------

export function CountrySelectTags(
  selected: CountryOption | CountryOption[],
  getItemProps: AutocompleteRenderValueGetItemProps<boolean | undefined>,
  _ownerState: AutocompleteOwnerState<
    CountryOption,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >,
) {
  const values = Array.isArray(selected) ? selected : [selected];

  return values.map((option, index) => {
    const country = getCountry(option);
    const itemProps = getItemProps({ index });

    return (
      <Chip
        {...itemProps}
        key={country.label}
        label={country.label}
        size="small"
        variant="soft"
        icon={
          <FlagIcon
            key={country.label}
            code={country.code}
            sx={{ width: 16, height: 16, borderRadius: "50%" }}
          />
        }
      />
    );
  });
}
