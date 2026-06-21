import type { SystemStyleObject } from "@mui/system";
import type { Theme, SxProps } from "@mui/material/styles";

import type { CarouselSlideOptions } from "./types";

// ----------------------------------------------------------------------

type SxArrayItem =
  | boolean
  | SystemStyleObject<Theme>
  | ((theme: Theme) => SystemStyleObject<Theme>);

export function mergeSx(
  base: SystemStyleObject<Theme>,
  extra?: SxProps<Theme>,
): SxProps<Theme> {
  const extraItems: SxArrayItem[] = extra
    ? Array.isArray(extra)
      ? [...extra]
      : [extra]
    : [];

  return [base, ...extraItems];
}

// ----------------------------------------------------------------------

export function getSize(slidesToShow?: CarouselSlideOptions["slidesToShow"]) {
  if (slidesToShow && typeof slidesToShow === "object") {
    return Object.keys(slidesToShow).reduce<Record<string, string>>(
      (acc, key) => {
        const sizeByKey = slidesToShow[key];
        acc[key] = getValue(sizeByKey);
        return acc;
      },
      {},
    );
  }

  return getValue(slidesToShow);
}

export function getValue(value: number | string = 1) {
  if (typeof value === "string") {
    const isSupported =
      value === "auto" || value.endsWith("%") || value.endsWith("px");
    if (!isSupported) {
      throw new Error(`Only accepts values: auto, px, %, or number.`);
    }
    // value is either 'auto', ends with '%', or ends with 'px'
    return `0 0 ${value}`;
  }

  if (typeof value === "number") {
    return `0 0 ${100 / value}%`;
  }

  // Default case should not be reached due to the type signature, but we include it for safety
  throw new Error(
    `Invalid value type. Only accepts values: auto, px, %, or number.`,
  );
}
