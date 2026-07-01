import type { ModelRelease } from "src/types/api";

import Stack from "@mui/material/Stack";
import { Label } from "src/components/label";
import { fDate } from "src/utils/format-time";
import Typography from "@mui/material/Typography";

import { vendorColor } from "./utils";

// ----------------------------------------------------------------------

interface ReleaseHeaderProps {
  release: ModelRelease;
}

/** Detail-page header: vendor chip · model · version · released date. */
export function ReleaseHeader({ release }: ReleaseHeaderProps) {
  const title = `${release.model} ${release.version}`.trim();

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ flexWrap: "wrap", alignItems: "center" }}
      >
        <Label variant="soft" color={vendorColor(release.vendor)}>
          {release.vendor}
        </Label>
        {release.releasedAt && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {fDate(release.releasedAt)}
          </Typography>
        )}
      </Stack>

      <Typography variant="h3">{title}</Typography>
    </Stack>
  );
}
