import type { AutocompleteRenderGetTagProps } from "@mui/material/Autocomplete";

import Chip from "@mui/material/Chip";
import { FlagIcon } from "src/components/iconify";

import { getCountry } from "./utils";

import type { CountryOption } from "./types";

// ----------------------------------------------------------------------

export function CountrySelectTags(
  selected: readonly CountryOption[],
  getTagProps: AutocompleteRenderGetTagProps,
) {
  return selected.map((option, index) => {
    const country = getCountry(option);

    return (
      <Chip
        {...getTagProps({ index })}
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
