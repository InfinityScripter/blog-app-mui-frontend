import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";

import { carouselClasses } from "../classes";

import type { CarouselThumbProps } from "./types";

// ----------------------------------------------------------------------

export function CarouselThumb({
  sx,
  src,
  index,
  selected,
  ...other
}: CarouselThumbProps) {
  return (
    <ButtonBase
      className={carouselClasses.thumb}
      sx={{
        width: 64,
        height: 64,
        opacity: 0.48,
        flexShrink: 0,
        cursor: "pointer",
        borderRadius: 1.25,
        transition: (theme) =>
          theme.transitions.create(["opacity", "box-shadow"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.short,
          }),
        ...(selected && {
          opacity: 1,
          boxShadow: (theme) =>
            `0 0 0 2px ${theme.vars?.palette.primary.main ?? theme.palette.primary.main}`,
        }),
        ...sx,
      }}
      {...other}
    >
      <Box
        component="img"
        alt={`carousel-thumb-${index}`}
        src={src}
        className={carouselClasses.thumbImage}
        sx={{
          width: 1,
          height: 1,
          objectFit: "cover",
          borderRadius: "inherit",
        }}
      />
    </ButtonBase>
  );
}
