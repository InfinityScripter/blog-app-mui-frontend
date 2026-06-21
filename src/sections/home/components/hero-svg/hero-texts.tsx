import type { Theme, SxProps } from "@mui/material/styles";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { varFade } from "src/components/animate";

// ----------------------------------------------------------------------

interface TextsProps {
  sx?: SxProps<Theme>;
}

export function Texts({ sx, ...other }: TextsProps) {
  return (
    <Stack
      component={m.div}
      variants={varFade().in}
      sx={{
        left: 0,
        width: 1,
        bottom: 0,
        zIndex: 0,
        height: 200,
        position: "absolute",
        ...sx,
      }}
      {...other}
    >
      <Box
        component="svg"
        width="100%"
        height="100%"
        sx={{
          "& text": {
            fill: "none",
            fontSize: 200,
            fontWeight: 800,
            strokeDasharray: 4,
            textTransform: "uppercase",
            stroke: "var(--hero-text-stroke-color)",
            strokeWidth: "var(--hero-text-stroke-width)",
            fontFamily: (theme: Theme) => theme.typography.fontSecondaryFamily,
          },
        }}
      >
        <m.text
          x="0"
          y="12px"
          dominantBaseline="hanging"
          animate={{ transform: ["translateX(0%)", "translateX(-50%)"] }}
          transition={{ duration: 64, ease: "linear", repeat: Infinity }}
        >
          MIKHAIL TALALAEV MIKHAIL TALALAEV
        </m.text>
      </Box>
    </Stack>
  );
}
