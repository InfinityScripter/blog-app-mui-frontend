import Divider from "@mui/material/Divider";
import ButtonBase from "@mui/material/ButtonBase";
import { Iconify, FlagIcon } from "src/components/iconify";

import type { CountryListButtonProps } from "./types";

// ----------------------------------------------------------------------

export function CountryListButton({ code, onOpen }: CountryListButtonProps) {
  return (
    <ButtonBase disableRipple onClick={onOpen}>
      <FlagIcon
        code={code}
        sx={{ width: 22, height: 22, borderRadius: "50%" }}
      />

      <Iconify
        icon="eva:chevron-down-fill"
        sx={{ ml: 0.5, flexShrink: 0, color: "text.disabled" }}
      />

      <Divider orientation="vertical" flexItem sx={{ mr: 1 }} />
    </ButtonBase>
  );
}
