import type { Theme } from "@mui/material/styles";
import type { ButtonProps } from "@mui/material/Button";

import { buttonClasses } from "@mui/material/Button";
// Removed loadingButtonClasses: in MUI v7, LoadingButton is deprecated and Button provides
// loading class names directly (e.g., MuiButton-loadingIndicatorStart/End, MuiButton-loadingWrapper)

import { varAlpha, stylesMode } from "../../styles";
import { type ColorType, type ThemeWithVars } from "./types";

const COLORS: ColorType[] = [
  "primary",
  "secondary",
  "info",
  "success",
  "warning",
  "error",
];

function styleColors(
  ownerState: ButtonProps,
  styles: (color: ColorType) => Record<string, unknown>,
) {
  const outputStyle = COLORS.reduce<Record<string, unknown>>((acc, color) => {
    if (!ownerState.disabled && ownerState.color === color) {
      acc = styles(color);
    }
    return acc;
  }, {});

  return outputStyle;
}

// ----------------------------------------------------------------------

const MuiButtonBase = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      fontFamily: theme.typography.fontFamily,
      transition: "transform 160ms cubic-bezier(0.23, 1, 0.32, 1)",
      "&:active": { transform: "scale(0.97)" },
    }),
  },
};

// ----------------------------------------------------------------------

const softVariant = {
  colors: COLORS.map((color) => ({
    props: ({ ownerState }: { ownerState: ButtonProps }) =>
      !ownerState.disabled &&
      ownerState.variant === "soft" &&
      ownerState.color === color,
    style: ({ theme }: { theme: Theme }) => ({
      color: theme.vars.palette[color].dark,
      backgroundColor: varAlpha(theme.vars.palette[color].mainChannel, 0.16),
      "&:hover": {
        backgroundColor: varAlpha(theme.vars.palette[color].mainChannel, 0.32),
      },
      [stylesMode.dark]: { color: theme.vars.palette[color].light },
    }),
  })),
  base: [
    {
      props: ({ ownerState }: { ownerState: ButtonProps }) =>
        ownerState.variant === "soft",
      style: ({ theme }: { theme: Theme }) => ({
        backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
        "&:hover": {
          backgroundColor: varAlpha(
            theme.vars.palette.grey["500Channel"],
            0.24,
          ),
        },
        "& .MuiButton-loadingIndicatorStart": { left: 14 },
        "& .MuiButton-loadingIndicatorEnd": { right: 14 },
        "& .MuiButton-loadingWrapper": { left: 14, right: 14 },
        [`&.${buttonClasses.sizeSmall}`]: {
          "& .MuiButton-loadingIndicatorStart": { left: 10 },
          "& .MuiButton-loadingIndicatorEnd": { right: 10 },
          "& .MuiButton-loadingWrapper": { left: 10, right: 10 },
        },
      }),
    },
  ],
};

const MuiButton = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { color: "inherit", disableElevation: true },

  /** **************************************
   * VARIANTS
   *************************************** */
  variants: [
    /**
     * @variant soft
     */
    ...[...softVariant.base, ...softVariant.colors],
  ],

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    /**
     * @variant contained
     */
    contained: ({
      theme,
      ownerState,
    }: {
      theme: ThemeWithVars;
      ownerState: ButtonProps;
    }) => {
      const styled = {
        colors: styleColors(ownerState, (color) => ({
          "&:hover": { boxShadow: theme.customShadows[color] },
        })),
        inheritColor: {
          ...(ownerState.color === "inherit" &&
            !ownerState.disabled && {
              color: theme.vars.palette.common.white,
              backgroundColor: theme.vars.palette.grey[800],
              "&:hover": {
                boxShadow: theme.customShadows.z8,
                backgroundColor: theme.vars.palette.grey[700],
              },
              [stylesMode.dark]: {
                color: theme.vars.palette.grey[800],
                backgroundColor: theme.vars.palette.common.white,
                "&:hover": { backgroundColor: theme.vars.palette.grey[400] },
              },
            }),
        },
      };
      return { ...styled.inheritColor, ...styled.colors };
    },
    /**
     * @variant outlined
     */
    outlined: ({
      theme,
      ownerState,
    }: {
      theme: Theme;
      ownerState: ButtonProps;
    }) => {
      const styled = {
        colors: styleColors(ownerState, (color) => ({
          borderColor: varAlpha(theme.vars.palette[color].mainChannel, 0.48),
        })),
        inheritColor: {
          ...(ownerState.color === "inherit" &&
            !ownerState.disabled && {
              borderColor: varAlpha(
                theme.vars.palette.grey["500Channel"],
                0.32,
              ),
              "&:hover": { backgroundColor: theme.vars.palette.action.hover },
            }),
        },
        base: {
          "&:hover": {
            borderColor: "currentColor",
            boxShadow: "0 0 0 0.75px currentColor",
          },
        },
      };
      return { ...styled.base, ...styled.inheritColor, ...styled.colors };
    },
    /**
     * @variant text
     */
    text: ({
      ownerState,
      theme,
    }: {
      ownerState: ButtonProps;
      theme: Theme;
    }) => {
      const styled = {
        inheritColor: {
          ...(ownerState.color === "inherit" &&
            !ownerState.disabled && {
              "&:hover": { backgroundColor: theme.vars.palette.action.hover },
            }),
        },
      };
      return { ...styled.inheritColor };
    },
    /**
     * @size
     */
    sizeSmall: ({ ownerState }: { ownerState: ButtonProps }) => ({
      height: 30,
      ...(ownerState.variant === "text"
        ? { paddingLeft: "4px", paddingRight: "4px" }
        : { paddingLeft: "8px", paddingRight: "8px" }),
    }),
    sizeMedium: ({ ownerState }: { ownerState: ButtonProps }) => ({
      ...(ownerState.variant === "text"
        ? { paddingLeft: "8px", paddingRight: "8px" }
        : { paddingLeft: "12px", paddingRight: "12px" }),
    }),
    sizeLarge: ({ ownerState }: { ownerState: ButtonProps }) => ({
      height: 48,
      ...(ownerState.variant === "text"
        ? { paddingLeft: "10px", paddingRight: "10px" }
        : { paddingLeft: "16px", paddingRight: "16px" }),
    }),
  },
};

// ----------------------------------------------------------------------

export const button = { MuiButtonBase, MuiButton };
