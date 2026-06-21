import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { FlagIcon } from "src/components/iconify";
import ListItemText from "@mui/material/ListItemText";
import { isSupportedCountry } from "react-phone-number-input";

import type { CountryListProps } from "./types";

// ----------------------------------------------------------------------

export function CountryList({
  countryCode,
  dataFiltered,
  onSelectCountry,
}: CountryListProps) {
  return (
    <MenuList>
      {dataFiltered.map((country) => {
        if (!country.code || !isSupportedCountry(country.code)) {
          return null;
        }

        const { code } = country;

        return (
          <MenuItem
            key={code}
            selected={countryCode === code}
            autoFocus={countryCode === code}
            onClick={() => {
              onSelectCountry(code);
            }}
          >
            <FlagIcon
              code={country.code}
              sx={{ mr: 1, width: 22, height: 22, borderRadius: "50%" }}
            />

            <ListItemText
              primary={country.label}
              secondary={`${country.code} (+${country.phone})`}
              primaryTypographyProps={{ noWrap: true, typography: "body2" }}
              secondaryTypographyProps={{ typography: "caption" }}
            />
          </MenuItem>
        );
      })}
    </MenuList>
  );
}
