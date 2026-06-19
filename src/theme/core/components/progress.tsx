import type { Theme } from "@mui/material/styles";
import type { LinearProgressProps } from "@mui/material/LinearProgress";

import { varAlpha } from "../../styles";
import { type ColorType } from "./types";

// ----------------------------------------------------------------------

const COLORS: ColorType[] = [
  "primary",
  "secondary",
  "info",
  "success",
  "warning",
  "error",
];

// ----------------------------------------------------------------------

function styleColors(
  ownerState: LinearProgressProps,
  styles: (color: ColorType) => Record<string, unknown>,
) {
  const outputStyle = COLORS.reduce<Record<string, unknown>>((acc, color) => {
    if (ownerState.color === color) {
      acc = styles(color);
    }
    return acc;
  }, {});

  return outputStyle;
}

const MuiLinearProgress = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({
      theme,
      ownerState,
    }: {
      theme: Theme;
      ownerState: LinearProgressProps;
    }) => {
      const styled = {
        colors: styleColors(ownerState, (color) => ({
          backgroundColor: varAlpha(
            theme.vars.palette[color].mainChannel,
            0.24,
          ),
        })),
        inheritColor: {
          ...(ownerState.color === "inherit" && {
            "&::before": { display: "none" },
            backgroundColor: varAlpha(
              theme.vars.palette.text.primaryChannel,
              0.24,
            ),
          }),
        },
      };
      return {
        borderRadius: 4,
        ...(ownerState.variant !== "buffer" && {
          ...styled.inheritColor,
          ...styled.colors,
        }),
      };
    },
    bar: { borderRadius: "inherit" },
  },
};

// ----------------------------------------------------------------------

export const progress = { MuiLinearProgress };
