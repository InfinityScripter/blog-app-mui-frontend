import type { ReactNode } from "react";
import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import { carouselClasses } from "../classes";

type CarouselAxis = "x" | "y";

interface StyledRootProps {
  axis: CarouselAxis;
  slideSpacing?: string;
}

interface SlidesToShowByBreakpoint {
  [key: string]: number | string;
}

interface CarouselSlideOptions {
  axis?: CarouselAxis;
  slideSpacing?: string;
  parallax?: boolean;
  slidesToShow?: number | string | SlidesToShowByBreakpoint;
}

interface CarouselSlideProps extends Omit<BoxProps, "children"> {
  children?: ReactNode;
  options?: CarouselSlideOptions;
  sx?: SxProps<Theme>;
}

const StyledRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "axis" && prop !== "slideSpacing",
})<StyledRootProps>(({ axis, slideSpacing }) => ({
  display: "block",
  position: "relative",
  ...(axis === "x" && {
    minWidth: 0,
    paddingLeft: slideSpacing,
  }),
  ...(axis === "y" && {
    minHeight: 0,
    paddingTop: slideSpacing,
  }),
}));

const StyledContent = styled(Box)(() => ({
  overflow: "hidden",
  position: "relative",
  borderRadius: "inherit",
}));

// ----------------------------------------------------------------------

export function CarouselSlide({
  sx,
  options,
  children,
  ...other
}: CarouselSlideProps) {
  const slideSize = getSize(options?.slidesToShow);

  return (
    <StyledRoot
      as="li"
      axis={options?.axis ?? "x"}
      slideSpacing={options?.slideSpacing}
      className={carouselClasses.slide}
      sx={{
        flex: slideSize,
        ...sx,
      }}
      {...other}
    >
      {options?.parallax ? (
        <StyledContent className={carouselClasses.slideContent}>
          <div className="slide__parallax__layer">{children}</div>
        </StyledContent>
      ) : (
        children
      )}
    </StyledRoot>
  );
}

function getSize(slidesToShow?: CarouselSlideOptions["slidesToShow"]) {
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

function getValue(value: number | string = 1) {
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
