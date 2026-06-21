import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import type { ButtonBaseProps } from "@mui/material/ButtonBase";

import SvgIcon from "@mui/material/SvgIcon";
import ButtonBase, { buttonBaseClasses } from "@mui/material/ButtonBase";

import { carouselClasses } from "../classes";

import type { CarouselOptions } from "../carousel";

// ----------------------------------------------------------------------

export interface ArrowButtonSlotProps {
  svgIcon?: ReactNode;
  svgSize?: number;
  sx?: SxProps<Theme>;
}

export interface ArrowButtonProps
  extends ArrowButtonSlotProps,
    Omit<ButtonBaseProps, "sx"> {
  options?: CarouselOptions;
  variant: "prev" | "next";
  sx?: SxProps<Theme>;
}

export function ArrowButton({
  sx,
  svgIcon,
  svgSize,
  options,
  variant,
  ...other
}: ArrowButtonProps) {
  const arrowPrev = variant === "prev";
  const arrowNext = variant === "next";

  const prevSvg = svgIcon || (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M15.488 4.43a.75.75 0 0 1 .081 1.058L9.988 12l5.581 6.512a.75.75 0 1 1-1.138.976l-6-7a.75.75 0 0 1 0-.976l6-7a.75.75 0 0 1 1.057-.081"
      clipRule="evenodd"
    />
  );

  const nextSvg = svgIcon || (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8.512 4.43a.75.75 0 0 1 1.057.082l6 7a.75.75 0 0 1 0 .976l-6 7a.75.75 0 0 1-1.138-.976L14.012 12L8.431 5.488a.75.75 0 0 1 .08-1.057"
      clipRule="evenodd"
    />
  );

  return (
    <ButtonBase
      className={
        arrowPrev ? carouselClasses.arrowPrev : carouselClasses.arrowPrev
      }
      aria-label={arrowPrev ? "Prev button" : "Next button"}
      sx={[
        {
          p: 1,
          borderRadius: "50%",
          boxSizing: "content-box",
          transition: (theme) =>
            theme.transitions.create(["opacity", "background-color"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.short,
            }),
          [`&.${buttonBaseClasses.disabled}`]: {
            opacity: 0.4,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
        options?.direction === "rtl" && {
          ...(arrowPrev && { right: -16, left: "auto" }),
          ...(arrowNext && { left: -16, right: "auto" }),
        },
      ]}
      {...other}
    >
      <SvgIcon
        className={carouselClasses.arrowSvg}
        sx={{
          width: svgSize ?? 20,
          height: svgSize ?? 20,
          ...(options?.axis === "y" && { transform: " rotate(90deg)" }),
          ...(options?.direction === "rtl" && { transform: " scaleX(-1)" }),
        }}
      >
        {arrowPrev ? prevSvg : nextSvg}
      </SvgIcon>
    </ButtonBase>
  );
}
