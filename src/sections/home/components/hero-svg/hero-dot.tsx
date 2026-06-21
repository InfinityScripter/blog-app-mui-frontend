import type { MarketingTheme } from "src/sections/home/components/types";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import { stylesMode } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";

import type { DotProps } from "./types";

// ----------------------------------------------------------------------

export function Dot({
  color = "primary",
  animate,
  transition,
  sx,
  ...other
}: DotProps) {
  const theme = useTheme<MarketingTheme>();

  return (
    <Box
      component={m.div}
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { duration: 0.64, ease: [0.43, 0.13, 0.23, 0.96] },
        },
      }}
      sx={{
        width: 12,
        height: 12,
        top: "50%",
        left: "50%",
        position: "absolute",
        ...sx,
      }}
      {...other}
    >
      <Box
        component={m.div}
        animate={animate}
        transition={
          transition ?? {
            duration: 6,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }
        }
        sx={{
          width: 1,
          height: 1,
          borderRadius: "50%",
          boxShadow: `0px -2px 4px 0px ${theme.vars.palette[color].main} inset`,
          background: `linear-gradient(135deg, ${theme.vars.palette[color].lighter}, ${theme.vars.palette[color].light})`,
          [stylesMode.dark]: {
            boxShadow: `0px -2px 4px 0px ${theme.vars.palette[color].dark} inset`,
          },
          ...sx,
        }}
      />
    </Box>
  );
}
