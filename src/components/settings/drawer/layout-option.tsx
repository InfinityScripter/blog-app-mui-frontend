import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { stylesMode } from "src/theme/styles";
import ButtonBase from "@mui/material/ButtonBase";

import type { LayoutOptionProps } from "./types";

// ----------------------------------------------------------------------

export function LayoutOption({
  option,
  selected,
  sx,
  ...other
}: LayoutOptionProps) {
  const renderNav = () => {
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
  };

  const renderContent = (
    <Box sx={{ p: 0.5, width: 1, height: 1, flexGrow: 1 }}>
      <Box
        sx={{
          width: 1,
          height: 1,
          opacity: 0.2,
          borderRadius: 0.75,
          bgcolor: "var(--item-bg)",
          ...(selected && { background: "var(--item-active-color)" }),
        }}
      />
    </Box>
  );

  return (
    <ButtonBase
      disableRipple
      sx={{
        width: 1,
        height: 64,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "var(--item-radius)",
        borderColor: "var(--item-border-color)",
        ...(option === "horizontal" && { flexDirection: "column" }),
        ...(selected && {
          boxShadow: "var(--item-active-shadow-light)",
          [stylesMode.dark]: {
            boxShadow: "var(--item-active-shadow-dark)",
          },
        }),
        ...sx,
      }}
      {...other}
    >
      {renderNav()}
      {renderContent}
    </ButtonBase>
  );
}
