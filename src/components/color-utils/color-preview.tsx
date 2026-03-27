import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import { varAlpha } from "src/theme/styles";

// ----------------------------------------------------------------------

interface ColorPreviewProps extends Omit<BoxProps, "children"> {
  colors: string[];
  limit?: number;
  sx?: SxProps<Theme>;
}

export const ColorPreview = forwardRef<HTMLDivElement, ColorPreviewProps>(
  ({ colors, limit = 3, sx, ...other }, ref) => {
    const colorsRange = colors.slice(0, limit);

    const restColors = colors.length - limit;

    return (
      <Box
        ref={ref}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          ...sx,
        }}
        {...other}
      >
        {colorsRange.map((color, index) => (
          <Box
            key={color + index}
            sx={{
              ml: -0.75,
              width: 16,
              height: 16,
              bgcolor: color,
              borderRadius: "50%",
              border: (theme) =>
                `solid 2px ${theme.vars?.palette.background.paper ?? theme.palette.background.paper}`,
              boxShadow: (theme) =>
                `inset -1px 1px 2px ${varAlpha(
                  (
                    theme.vars?.palette.common as
                      | Record<string, string>
                      | undefined
                  )?.blackChannel ?? theme.palette.common.black,
                  0.24,
                )}`,
            }}
          />
        ))}

        {colors.length > limit && (
          <Box
            component="span"
            sx={{ typography: "subtitle2" }}
          >{`+${restColors}`}</Box>
        )}
      </Box>
    );
  },
);
