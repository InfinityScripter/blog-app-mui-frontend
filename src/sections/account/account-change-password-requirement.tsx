import Stack from "@mui/material/Stack";
import { Iconify } from "src/components/iconify";

import type { RequirementProps } from "./types";

// ----------------------------------------------------------------------

export function Requirement({ ok, children }: RequirementProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        typography: "body2",
        color: ok ? "success.main" : "text.secondary",
        transition: (theme) => theme.transitions.create("color"),
      }}
    >
      <Iconify
        width={18}
        icon={ok ? "solar:check-circle-bold" : "solar:close-circle-linear"}
        sx={{ flexShrink: 0, color: ok ? "success.main" : "text.disabled" }}
      />
      {children}
    </Stack>
  );
}
