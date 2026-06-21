import Stack from "@mui/material/Stack";
import { Label } from "src/components/label";

// ----------------------------------------------------------------------

export function TagsAction() {
  return (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1.5 }}>
      <Label variant="outlined" color="info">
        Design
      </Label>
      <Label variant="outlined" color="warning">
        Dashboard
      </Label>
      <Label variant="outlined">Design system</Label>
    </Stack>
  );
}
