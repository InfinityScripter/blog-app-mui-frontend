import type { Theme } from "@mui/material/styles";
import type { ButtonGroupProps } from "@mui/material/ButtonGroup";

import { buttonGroupClasses } from "@mui/material/ButtonGroup";

import { type ColorType } from "./types";
import { varAlpha, stylesMode } from "../../styles";

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"];

function styleColors(
  ownerState: ButtonGroupProps,
  styles: (color: ColorType) => Record<string, unknown>,
) {
  const outputStyle = (COLORS as ColorType[]).reduce<Record<string, unknown>>(
    (acc, color) => {
      if (!ownerState.disabled && ownerState.color === color) {
        acc = styles(color);
      }
      return acc;
    },
    {},
  );

  return outputStyle;
}

const buttonClasses = `& .${buttonGroupClasses.firstButton}, & .${buttonGroupClasses.middleButton}`;

const softVariant = {
  colors: (COLORS as ColorType[]).map((color) => ({
    props: ({ ownerState }: { ownerState: ButtonGroupProps }) =>
      !ownerState.disabled &&
      ownerState.variant === "soft" &&
      ownerState.color === color,
    style: ({ theme }: { theme: Theme }) => ({
      [buttonClasses]: {
        borderColor: varAlpha(theme.vars.palette[color].darkChannel, 0.24),
        [stylesMode.dark]: {
          borderColor: varAlpha(theme.vars.palette[color].lightChannel, 0.24),
        },
      },
      [`&.${buttonGroupClasses.vertical}`]: {
        [buttonClasses]: {
          borderColor: varAlpha(theme.vars.palette[color].darkChannel, 0.24),
          [stylesMode.dark]: {
            borderColor: varAlpha(theme.vars.palette[color].lightChannel, 0.24),
          },
        },
      },
    }),
  })),
  base: [
    {
      props: ({ ownerState }: { ownerState: ButtonGroupProps }) =>
        ownerState.variant === "soft",
      style: ({ theme }: { theme: Theme }) => ({
        [buttonClasses]: {
          borderRight: `solid 1px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.32)}`,
          [`&.${buttonGroupClasses.disabled}`]: {
            borderColor: theme.vars.palette.action.disabledBackground,
          },
        },
        [`&.${buttonGroupClasses.vertical}`]: {
          [buttonClasses]: {
            borderRight: "none",
            borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.32)}`,
            [`&.${buttonGroupClasses.disabled}`]: {
              borderColor: theme.vars.palette.action.disabledBackground,
            },
          },
        },
      }),
    },
  ],
};

// ----------------------------------------------------------------------

const MuiButtonGroup = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { disableElevation: true },

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
      theme: Theme;
      ownerState: ButtonGroupProps;
    }) => {
      const styled = {
        colors: styleColors(ownerState, (color) => ({
          [buttonClasses]: {
            borderColor: varAlpha(theme.vars.palette[color].darkChannel, 0.48),
          },
        })),
        inheritColor: {
          ...(ownerState.color === "inherit" && {
            [buttonClasses]: {
              borderColor: varAlpha(
                theme.vars.palette.grey["500Channel"],
                0.32,
              ),
            },
          }),
        },
        disabled: {
          ...(ownerState.disabled && {
            [buttonClasses]: {
              [`&.${buttonGroupClasses.disabled}`]: {
                borderColor: theme.vars.palette.action.disabledBackground,
              },
            },
          }),
        },
      };

      return { ...styled.inheritColor, ...styled.colors, ...styled.disabled };
    },
    /**
     * @variant text
     */
    text: ({
      theme,
      ownerState,
    }: {
      theme: Theme;
      ownerState: ButtonGroupProps;
    }) => {
      const styled = {
        colors: styleColors(ownerState, (color) => ({
          [buttonClasses]: {
            borderColor: varAlpha(theme.vars.palette[color].mainChannel, 0.48),
          },
        })),
        inheritColor: {
          ...(ownerState.color === "inherit" && {
            [buttonClasses]: {
              borderColor: varAlpha(
                theme.vars.palette.grey["500Channel"],
                0.32,
              ),
            },
          }),
        },
        disabled: {
          ...(ownerState.disabled && {
            [buttonClasses]: {
              [`&.${buttonGroupClasses.disabled}`]: {
                borderColor: theme.vars.palette.action.disabledBackground,
              },
            },
          }),
        },
      };

      return { ...styled.inheritColor, ...styled.colors, ...styled.disabled };
    },
  },
};

// ----------------------------------------------------------------------

export const buttonGroup = { MuiButtonGroup };
