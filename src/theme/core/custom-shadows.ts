import type { ColorScheme } from "src/types/domain";

import { varAlpha } from "../styles/utils";
import {
  grey,
  info,
  error,
  common,
  primary,
  success,
  warning,
  secondary,
} from "./palette";

// ----------------------------------------------------------------------

export function createShadowColor(colorChannel: string): string {
  return `0 8px 16px 0 ${varAlpha(colorChannel, 0.24)}`;
}

export interface CustomShadows {
  z1: string;
  z4: string;
  z8: string;
  z12: string;
  z16: string;
  z20: string;
  z24: string;
  dialog: string;
  card: string;
  dropdown: string;
  primary: string;
  secondary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

export function customShadows(colorScheme: ColorScheme): CustomShadows {
  const colorChannel =
    colorScheme === "light" ? grey["500Channel"] : common.blackChannel;

  return {
    z1: `0 1px 2px 0 ${varAlpha(colorChannel, 0.16)}`,
    z4: `0 4px 8px 0 ${varAlpha(colorChannel, 0.16)}`,
    z8: `0 8px 16px 0 ${varAlpha(colorChannel, 0.16)}`,
    z12: `0 12px 24px -4px ${varAlpha(colorChannel, 0.16)}`,
    z16: `0 16px 32px -4px ${varAlpha(colorChannel, 0.16)}`,
    z20: `0 20px 40px -4px ${varAlpha(colorChannel, 0.16)}`,
    z24: `0 24px 48px 0 ${varAlpha(colorChannel, 0.16)}`,
    //
    dialog: `-40px 40px 80px -8px ${varAlpha(common.blackChannel, 0.24)}`,
    // Editorial Ink: cards rest almost flat (hairline border carries the edge);
    // depth is reserved for hover states at the section level.
    card: `0 1px 2px 0 ${varAlpha(colorChannel, 0.08)}`,
    dropdown: `0 0 2px 0 ${varAlpha(
      colorChannel,
      0.24,
    )}, -20px 20px 40px -4px ${varAlpha(colorChannel, 0.24)}`,
    //
    primary: createShadowColor(primary.mainChannel),
    secondary: createShadowColor(secondary.mainChannel),
    info: createShadowColor(info.mainChannel),
    success: createShadowColor(success.mainChannel),
    warning: createShadowColor(warning.mainChannel),
    error: createShadowColor(error.mainChannel),
  };
}
