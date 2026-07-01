import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import { varAlpha } from "src/theme/styles";
import { Label } from "src/components/label";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import type { PostSearchButtonProps } from "../types";

// ----------------------------------------------------------------------

// Same trigger visual language as the dashboard cmd+k SearchButton
// (src/layouts/components/searchbar/search-button.tsx) — kept as a local
// copy rather than a cross-module deep import since that module only
// exports its top-level `Searchbar`.
export function PostSearchButton({ onOpen, sx, ...other }: PostSearchButtonProps) {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={onOpen}
      sx={{
        pr: { sm: 1 },
        borderRadius: { sm: 1.5 },
        cursor: { sm: "pointer" },
        bgcolor: { sm: varAlpha(theme.vars.palette.grey["500Channel"], 0.08) },
        ...sx,
      }}
      {...other}
    >
      <IconButton disableRipple>
        {/* https://icon-sets.iconify.design/eva/search-fill/ */}
        <SvgIcon sx={{ width: 20, height: 20 }}>
          <path
            fill="currentColor"
            d="m20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8a7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42M5 11a6 6 0 1 1 6 6a6 6 0 0 1-6-6"
          />
        </SvgIcon>
      </IconButton>

      <Label
        sx={{
          fontSize: 12,
          color: "grey.800",
          bgcolor: "common.white",
          boxShadow: theme.customShadows.z1,
          display: { xs: "none", sm: "inline-flex" },
        }}
      >
        ⌘K
      </Label>
    </Box>
  );
}
