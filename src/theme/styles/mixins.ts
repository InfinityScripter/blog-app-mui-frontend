import { CONFIG } from "src/config-global";
import { dividerClasses } from "@mui/material/Divider";
import { checkboxClasses } from "@mui/material/Checkbox";
import { menuItemClasses } from "@mui/material/MenuItem";
import { autocompleteClasses } from "@mui/material/Autocomplete";

import { remToPx, varAlpha, mediaQueries } from "./utils";

// ----------------------------------------------------------------------

/**
 * Usage:
 * ...hideScrollY,
 */
export const hideScrollY = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  overflowY: "auto",
  "&::-webkit-scrollbar": { display: "none" },
};

/**
 * Usage:
 * ...bgBlur({ color: `varAlpha(theme.vars.palette.background.paperChannel, 0.8)`, imgUrl: '/assets/background/overlay.png', blur: 6 }),
 */
interface BgBlurProps {
  color: string;
  blur?: number;
  imgUrl?: string;
}

export function bgBlur({
  color,
  blur = 6,
  imgUrl,
}: BgBlurProps): Record<
  string,
  string | number | Record<string, string | number>
> {
  if (imgUrl) {
    return {
      position: "relative",
      backgroundImage: `url(${imgUrl})`,
      "&::before": {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: "100%",
        height: "100%",
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: color,
      },
    };
  }
  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: color,
  };
}

/**
 * Usage:
 * ...maxLine({ line: 2, persistent: theme.typography.caption }),
 */
function getFontSize(fontSize: string | number | undefined): number {
  if (!fontSize) return 16;
  return typeof fontSize === "string" ? remToPx(fontSize) : fontSize;
}

function getLineHeight(
  lineHeight: string | number | undefined,
  fontSize: number,
): number {
  if (typeof lineHeight === "string") {
    return fontSize ? remToPx(lineHeight) / fontSize : 1;
  }
  return lineHeight ?? 1;
}

interface ResponsiveFontSize {
  fontSize?: string | number;
  lineHeight?: string | number;
}

interface MaxLineProps {
  line: number;
  persistent?: ResponsiveFontSize & {
    [key: string]: unknown;
  };
}

function getResponsiveFontSize(value: unknown): string | number | undefined {
  if (typeof value === "object" && value !== null && "fontSize" in value) {
    const { fontSize } = value;
    if (typeof fontSize === "string" || typeof fontSize === "number") {
      return fontSize;
    }
  }
  return undefined;
}

export function maxLine({
  line,
  persistent,
}: MaxLineProps): Record<string, string | number | Record<string, number>> {
  const baseStyles = {
    overflow: "hidden",
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitLineClamp: line,
    WebkitBoxOrient: "vertical",
  };

  if (persistent) {
    const fontSizeBase = getFontSize(persistent.fontSize);
    const fontSizeSm = getFontSize(
      getResponsiveFontSize(persistent[mediaQueries.upSm]),
    );
    const fontSizeMd = getFontSize(
      getResponsiveFontSize(persistent[mediaQueries.upMd]),
    );
    const fontSizeLg = getFontSize(
      getResponsiveFontSize(persistent[mediaQueries.upLg]),
    );

    const lineHeight = getLineHeight(persistent.lineHeight, fontSizeBase);

    return {
      ...baseStyles,
      ...(lineHeight && {
        ...(fontSizeBase && { height: fontSizeBase * lineHeight * line }),
        ...(fontSizeSm && {
          [mediaQueries.upSm]: { height: fontSizeSm * lineHeight * line },
        }),
        ...(fontSizeMd && {
          [mediaQueries.upMd]: { height: fontSizeMd * lineHeight * line },
        }),
        ...(fontSizeLg && {
          [mediaQueries.upLg]: { height: fontSizeLg * lineHeight * line },
        }),
      }),
    };
  }

  return baseStyles;
}

/**
 * Usage:
 * ...paper({ theme, color: varAlpha(theme.vars.palette.background.paperChannel, 0.9), dropdown: true }),
 */
import type { ThemeWithVars } from "../core/components/types";

interface PaperProps {
  theme: ThemeWithVars;
  color?: string;
  dropdown?: boolean;
}

export function paper({
  theme,
  color,
  dropdown,
}: PaperProps): Record<
  string,
  string | number | Record<string, string | number>
> {
  return {
    ...bgBlur({
      color: color ?? varAlpha(theme.vars.palette.background.paperChannel, 0.9),
      blur: 20,
    }),
    backgroundImage: `url(${CONFIG.site.basePath}/assets/cyan-blur.png), url(${CONFIG.site.basePath}/assets/red-blur.png)`,
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundPosition: "top right, left bottom",
    backgroundSize: "50%, 50%",
    ...(theme.direction === "rtl" && {
      backgroundPosition: "top left, right bottom",
    }),
    ...(dropdown && {
      padding: theme.spacing(0.5),
      boxShadow: theme.customShadows.dropdown,
      borderRadius: `${Number(theme.shape.borderRadius) * 1.25}px`,
    }),
  };
}

/**
 * Usage:
 * ...menuItem(theme)
 */
export function menuItem(theme: ThemeWithVars): Record<string, unknown> {
  return {
    ...theme.typography.body2,
    padding: theme.spacing(0.75, 1),
    borderRadius: Number(theme.shape.borderRadius) * 0.75,
    "&:not(:last-of-type)": { marginBottom: 4 },
    [`&.${menuItemClasses.selected}`]: {
      fontWeight: theme.typography.fontWeightSemiBold,
      backgroundColor: theme.vars.palette.action.selected,
      "&:hover": { backgroundColor: theme.vars.palette.action.hover },
    },
    [`& .${checkboxClasses.root}`]: {
      padding: theme.spacing(0.5),
      marginLeft: theme.spacing(-0.5),
      marginRight: theme.spacing(0.5),
    },
    [`&.${autocompleteClasses.option}[aria-selected="true"]`]: {
      backgroundColor: theme.vars.palette.action.selected,
      "&:hover": { backgroundColor: theme.vars.palette.action.hover },
    },
    [`&+.${dividerClasses.root}`]: { margin: theme.spacing(0.5, 0) },
  };
}
