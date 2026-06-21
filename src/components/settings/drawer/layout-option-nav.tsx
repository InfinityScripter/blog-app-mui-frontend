import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import type { LayoutOptionNavProps } from "./types";

// ----------------------------------------------------------------------

export function LayoutOptionNav({ option, selected }: LayoutOptionNavProps) {
  const baseStyles = {
    flexShrink: 0,
    borderRadius: 1,
    bgcolor: "var(--item-bg)",
  };

  const circle = (
    <Box
      sx={{
        ...baseStyles,
        width: 10,
        height: 10,
        opacity: 0.8,
        ...(selected && {
          opacity: 1,
          background: "var(--item-active-color)",
        }),
      }}
    />
  );

  const primaryItem = (
    <Box
      sx={{
        ...baseStyles,
        width: 1,
        height: 4,
        opacity: 0.48,
        ...(option === "horizontal" && { width: 16 }),
        ...(selected && { background: "var(--item-active-color)" }),
      }}
    />
  );

  const secondaryItem = (
    <Box
      sx={{
        ...baseStyles,
        width: 1,
        height: 4,
        maxWidth: 14,
        opacity: 0.24,
        ...(option === "horizontal" && { maxWidth: 10 }),
        ...(selected && { background: "var(--item-active-color)" }),
      }}
    />
  );

  return (
    <Stack
      spacing={0.5}
      flexShrink={0}
      sx={{
        p: 0.75,
        width: 32,
        height: 1,
        borderRightWidth: 1,
        borderRightStyle: "solid",
        borderRightColor: "var(--item-border-color)",
        ...(option === "mini" && {
          width: 22,
        }),
        ...(option === "horizontal" && {
          width: 1,
          height: 22,
          borderRight: "none",
          alignItems: "center",
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: "var(--item-border-color)",
        }),
      }}
    >
      {circle}
      {primaryItem}
      {secondaryItem}
    </Stack>
  );
}
