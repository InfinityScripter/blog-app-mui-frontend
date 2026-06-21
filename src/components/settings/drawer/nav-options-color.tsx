import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import { getNavLabelStyles } from "./utils";
import { ColorOption } from "./color-option";

import type { NavOptionsColorProps } from "./types";

// ----------------------------------------------------------------------

export function NavOptionsColor({
  options,
  value,
  onClickOption,
}: NavOptionsColorProps) {
  const theme = useTheme();

  const labelStyles = getNavLabelStyles(theme);

  return (
    <div>
      <Box component="span" sx={labelStyles}>
        Color
      </Box>
      <Box gap={1.5} display="flex" sx={{ mt: 1.5 }}>
        {options.map((option) => (
          <ColorOption
            key={option}
            option={option}
            selected={value === option}
            onClick={() => onClickOption(option)}
          />
        ))}
      </Box>
    </div>
  );
}
