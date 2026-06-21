import { m } from "framer-motion";
import Box from "@mui/material/Box";
import { varAlpha } from "src/theme/styles";

import { Logo } from "../logo";

import type { AnimateLogo2Props } from "./types";

// ----------------------------------------------------------------------

export function AnimateLogo2({ logo, sx, ...other }: AnimateLogo2Props) {
  const primaryMainChannel =
    "var(--palette-primary-mainChannel, var(--palette-primary-main, 32 101 209))";
  const primaryMain = "var(--palette-primary-main, #2065d1)";

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 96,
        height: 96,
        position: "relative",
        alignItems: "center",
        display: "inline-flex",
        justifyContent: "center",
        ...sx,
      }}
      {...other}
    >
      {logo ?? <Logo sx={{ zIndex: 9 }} />}

      <Box
        component={m.div}
        animate={{ transform: "rotate(360deg)" }}
        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
        sx={{
          width: 1,
          height: 1,
          opacity: 0.16,
          borderRadius: "50%",
          position: "absolute",
          transition: (theme) =>
            theme.transitions.create(["opacity"], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.shorter,
            }),
          background: (theme) =>
            `linear-gradient(135deg, ${varAlpha(theme.vars?.palette.primary.mainChannel ?? primaryMainChannel, 0)} 50%, ${theme.vars?.palette.primary.main ?? primaryMain} 100%)`,
        }}
      />
    </Box>
  );
}
