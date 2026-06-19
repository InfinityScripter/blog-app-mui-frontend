import type { Theme } from "@mui/material/styles";
import type { SliderProps } from "@mui/material/Slider";

import { sliderClasses } from "@mui/material/Slider";

import { type ThemeWithVars } from "./types";
import { varAlpha, stylesMode } from "../../styles";

// ----------------------------------------------------------------------

/**
 * This override targets `color="inherit"`, which the app uses at runtime but
 * the base MUI `SliderProps["color"]` union does not include. Widen only the
 * `color` field for the predicate; no value or runtime behaviour changes.
 */
type SliderOwnerState = Omit<SliderProps, "color"> & {
  color?: SliderProps["color"] | "inherit";
};

const SIZE = {
  rail: { small: 6, medium: 10 },
  thumb: { small: 16, medium: 20 },
  mark: { small: 4, medium: 6 },
};

const MuiSlider = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { size: "small" },

  /** **************************************
   * VARIANTS
   *************************************** */
  variants: [
    /**
     * @color inherit
     */
    {
      props: ({ ownerState }: { ownerState: SliderOwnerState }) =>
        ownerState.color === "inherit",
      style: ({ theme }: { theme: Theme }) => ({
        [`& .${sliderClasses.markActive}`]: {
          [stylesMode.dark]: {
            backgroundColor: varAlpha(
              theme.vars.palette.grey["800Channel"],
              0.48,
            ),
          },
        },
      }),
    },
    /**
     * @state disabled
     */
    {
      props: ({ ownerState }: { ownerState: SliderProps }) =>
        !!ownerState.disabled,
      style: ({ theme }: { theme: Theme }) => ({
        [`&.${sliderClasses.disabled}`]: {
          color: varAlpha(
            theme.vars.palette.grey["500Channel"],
            theme.vars.palette.action.disabledOpacity,
          ),
        },
      }),
    },
  ],

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: ThemeWithVars }) => ({
      [`& .${sliderClasses.thumb}`]: {
        borderWidth: 1,
        borderStyle: "solid",
        width: SIZE.thumb.medium,
        height: SIZE.thumb.medium,
        boxShadow: theme.customShadows.z1,
        color: theme.vars.palette.common.white,
        borderColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
        "&::before": {
          opacity: 0.4,
          boxShadow: "none",
          width: "calc(100% - 4px)",
          height: "calc(100% - 4px)",
          backgroundImage: `linear-gradient(180deg, ${theme.vars.palette.grey[500]} 0%, ${varAlpha(theme.vars.palette.grey["500Channel"], 0)} 100%)`,
          [stylesMode.dark]: { opacity: 0.8 },
        },
      },
    }),
    rail: ({ theme }: { theme: Theme }) => ({
      opacity: 0.12,
      height: SIZE.rail.medium,
      backgroundColor: theme.vars.palette.grey[500],
    }),
    track: { height: SIZE.rail.medium },
    mark: ({ theme }: { theme: Theme }) => ({
      width: 1,
      height: SIZE.mark.medium,
      backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.48),
      '&[data-index="0"]': { display: "none" },
    }),
    markActive: ({ theme }: { theme: Theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.common.whiteChannel, 0.64),
    }),
    markLabel: ({ theme }: { theme: Theme }) => ({
      fontSize: theme.typography.pxToRem(13),
      color: theme.vars.palette.text.disabled,
    }),
    valueLabel: ({ theme }: { theme: Theme }) => ({
      borderRadius: 8,
      backgroundColor: theme.vars.palette.grey[800],
      [stylesMode.dark]: { backgroundColor: theme.vars.palette.grey[700] },
    }),
    sizeSmall: {
      [`& .${sliderClasses.thumb}`]: {
        width: SIZE.thumb.small,
        height: SIZE.thumb.small,
      },
      [`& .${sliderClasses.rail}`]: { height: SIZE.rail.small },
      [`& .${sliderClasses.track}`]: { height: SIZE.rail.small },
      [`& .${sliderClasses.mark}`]: { height: SIZE.mark.small },
    },
  },
};

// ----------------------------------------------------------------------

export const slider = {
  MuiSlider,
};
