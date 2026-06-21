import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";

import type { ContactCardProps } from "./types";

// ----------------------------------------------------------------------

export function ContactCard({ item }: ContactCardProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const borderColor = isDarkMode
    ? alpha(theme.palette.common.white, 0.16)
    : alpha(theme.palette.grey[500], 0.24);

  const isInteractive = Boolean(item.href);

  const card = (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        height: 1,
        borderColor,
        bgcolor: "transparent",
        transition: theme.transitions.create(
          ["border-color", "background-color", "transform"],
          { duration: theme.transitions.duration.shorter },
        ),
        ...(isInteractive && {
          "@media (hover: hover) and (pointer: fine)": {
            "&:hover": {
              transform: "translateY(-4px)",
              borderColor: alpha(theme.palette.primary.main, 0.6),
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
          },
        }),
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1.5,
            color: "primary.main",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <Iconify icon={item.icon} width={24} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {item.label}
          </Typography>
          <Typography variant="subtitle2" noWrap sx={{ color: "text.primary" }}>
            {item.value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  if (!item.href) {
    return card;
  }

  return (
    <Link
      href={item.href}
      underline="none"
      color="inherit"
      {...(item.external && { target: "_blank", rel: "noopener" })}
      sx={{ display: "block", height: 1 }}
    >
      {card}
    </Link>
  );
}
