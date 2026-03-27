import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import { varAlpha } from "src/theme/styles";
import { styled } from "@mui/material/styles";

import { carouselClasses } from "../classes";

// ----------------------------------------------------------------------

const StyledRoot = styled(Box)(({ theme }) => {
  const greyVars = theme.vars?.palette.grey as
    | Record<string, string>
    | undefined;
  const textPrimary =
    theme.vars?.palette.text.primary ?? theme.palette.text.primary;
  const grey500Channel =
    greyVars?.["500Channel"] ?? theme.palette.grey[500] ?? "145 158 171";

  return {
    height: 6,
    maxWidth: 120,
    width: "100%",
    borderRadius: 6,
    overflow: "hidden",
    position: "relative",
    color: textPrimary,
    backgroundColor: varAlpha(grey500Channel, 0.2),
  };
});

const StyledProgress = styled(Box)(() => ({
  top: 0,
  bottom: 0,
  width: "100%",
  left: "-100%",
  position: "absolute",
  backgroundColor: "currentColor",
}));

// ----------------------------------------------------------------------

interface CarouselProgressBarProps extends BoxProps {
  value: number;
  sx?: SxProps<Theme>;
}

export function CarouselProgressBar({
  value,
  sx,
  ...other
}: CarouselProgressBarProps) {
  return (
    <StyledRoot sx={sx} className={carouselClasses.progress} {...other}>
      <StyledProgress
        className={carouselClasses.progressBar}
        sx={{
          transform: `translate3d(${value}%, 0px, 0px)`,
        }}
      />
    </StyledRoot>
  );
}
