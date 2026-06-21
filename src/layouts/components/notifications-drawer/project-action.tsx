import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { reader } from "./utils";

// ----------------------------------------------------------------------

export function ProjectAction() {
  return (
    <Stack alignItems="flex-start">
      <Box
        sx={{
          p: 1.5,
          my: 1.5,
          borderRadius: 1.5,
          color: "text.secondary",
          bgcolor: "background.neutral",
        }}
      >
        {reader(
          `<p><strong>@Jaydon Frankie</strong> feedback by asking questions or just leave a note of appreciation.</p>`,
        )}
      </Box>

      <Button size="small" variant="contained">
        Reply
      </Button>
    </Stack>
  );
}
