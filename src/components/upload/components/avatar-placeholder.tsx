import Box from "@mui/material/Box";
import { varAlpha } from "src/theme/styles";
import Typography from "@mui/material/Typography";

import { Iconify } from "../../iconify";

import type { AvatarPlaceholderProps } from "../types";

// ----------------------------------------------------------------------

export function AvatarPlaceholder({
  hasFile,
  hasError,
}: AvatarPlaceholderProps) {
  return (
    <Box
      className="upload-placeholder"
      sx={{
        top: 0,
        gap: 1,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        display: "flex",
        borderRadius: "50%",
        position: "absolute",
        alignItems: "center",
        color: "text.disabled",
        flexDirection: "column",
        justifyContent: "center",
        bgcolor: (theme) =>
          varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
        transition: (theme) =>
          theme.transitions.create(["opacity"], {
            duration: theme.transitions.duration.shorter,
          }),
        "&:hover": { opacity: 0.72 },
        ...(hasError && {
          color: "error.main",
          bgcolor: (theme) =>
            varAlpha(theme.vars.palette.error.mainChannel, 0.08),
        }),
        ...(hasFile && {
          zIndex: 9,
          opacity: 0,
          color: "common.white",
          bgcolor: (theme) =>
            varAlpha(theme.vars.palette.grey["900Channel"], 0.64),
        }),
      }}
    >
      <Iconify icon="solar:camera-add-bold" width={32} />

      <Typography variant="caption">
        {hasFile ? "Обновить фото" : "Загрузить фото"}
      </Typography>
    </Box>
  );
}
