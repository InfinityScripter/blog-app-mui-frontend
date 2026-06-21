import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import { getNavLabelStyles } from "./utils";
import { LayoutOption } from "./layout-option";

import type { NavOptionsLayoutProps } from "./types";

// ----------------------------------------------------------------------

export function NavOptionsLayout({
  options,
  value,
  onClickOption,
}: NavOptionsLayoutProps) {
  const theme = useTheme();

  const labelStyles = getNavLabelStyles(theme);

  return (
    <div>
      <Box component="span" sx={labelStyles}>
        Layout
      </Box>
      <Box gap={1.5} display="flex" sx={{ mt: 1.5 }}>
        {options.map((option) => (
          <LayoutOption
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
