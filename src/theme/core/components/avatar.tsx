import type { Theme } from "@mui/material/styles";
import type { AvatarProps } from "@mui/material/Avatar";
import type { AvatarGroupProps } from "@mui/material/AvatarGroup";

import { avatarGroupClasses } from "@mui/material/AvatarGroup";

import { varAlpha } from "../../styles";
import { type ColorType, type ThemeWithVars } from "./types";

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"];

/**
 * The base MUI `Avatar` has no `color` prop, but the app drives its custom
 * color variants off `ownerState.color`. Type the ownerState as the real
 * `AvatarProps` plus the extra fields the overrides read.
 */
type AvatarOwnerState = AvatarProps & { color?: ColorType | "default" };

/**
 * The app adds a custom `compact` variant to `AvatarGroup` via `variants`.
 */
type AvatarGroupOwnerState = Omit<AvatarGroupProps, "variant"> & {
  variant?: AvatarGroupProps["variant"] | "compact";
};

const colorByName = (name: string): ColorType | "default" => {
  const charAt = name.charAt(0).toLowerCase();

  if (["a", "c", "f"].includes(charAt)) return "primary";
  if (["e", "d", "h"].includes(charAt)) return "secondary";
  if (["i", "k", "l"].includes(charAt)) return "info";
  if (["m", "n", "p"].includes(charAt)) return "success";
  if (["q", "s", "t"].includes(charAt)) return "warning";
  if (["v", "x", "y"].includes(charAt)) return "error";
  return "default";
};

// ----------------------------------------------------------------------

const avatarColors = {
  colors: (COLORS as ColorType[]).map((color) => ({
    props: ({ ownerState }: { ownerState: AvatarOwnerState }) =>
      ownerState.color === color,
    style: ({ theme }: { theme: Theme }) => ({
      color: theme.vars.palette[color].contrastText,
      backgroundColor: theme.vars.palette[color].main,
    }),
  })),
  defaultColor: [
    {
      props: ({ ownerState }: { ownerState: AvatarOwnerState }) =>
        ownerState.color === "default",
      style: ({ theme }: { theme: Theme }) => ({
        color: theme.vars.palette.text.secondary,
        backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.24),
      }),
    },
  ],
};

const MuiAvatar = {
  /** **************************************
   * VARIANTS
   *************************************** */
  variants: [...[...avatarColors.defaultColor, ...avatarColors.colors]],

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    rounded: ({ theme }: { theme: Theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 1.5,
    }),
    colorDefault: ({
      ownerState,
      theme,
    }: {
      ownerState: AvatarOwnerState;
      theme: Theme;
    }) => {
      const color = colorByName(`${ownerState.alt}`);

      return {
        ...(!!ownerState.alt && {
          ...(color !== "default"
            ? {
                color: theme.vars.palette[color].contrastText,
                backgroundColor: theme.vars.palette[color].main,
              }
            : {
                color: theme.vars.palette.text.secondary,
                backgroundColor: varAlpha(
                  theme.vars.palette.grey["500Channel"],
                  0.24,
                ),
              }),
        }),
      };
    },
  },
};

// ----------------------------------------------------------------------

const MuiAvatarGroup = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { max: 4 },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ ownerState }: { ownerState: AvatarGroupOwnerState }) => ({
      justifyContent: "flex-end",
      ...(ownerState.variant === "compact" && {
        width: 40,
        height: 40,
        position: "relative",
        [`& .${avatarGroupClasses.avatar}`]: {
          margin: 0,
          width: 28,
          height: 28,
          position: "absolute",
          "&:first-of-type": { left: 0, bottom: 0, zIndex: 9 },
          "&:last-of-type": { top: 0, right: 0 },
        },
      }),
    }),
    avatar: ({ theme }: { theme: ThemeWithVars }) => ({
      fontSize: 16,
      fontWeight: theme.typography.fontWeightSemiBold,
      "&:first-of-type": {
        fontSize: 12,
        color: theme.vars.palette.primary.dark,
        backgroundColor: theme.vars.palette.primary.lighter,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const avatar = { MuiAvatar, MuiAvatarGroup };
