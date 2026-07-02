import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { hairline } from "src/theme/styles/editorial";

// ----------------------------------------------------------------------

const ROWS = [0, 1, 2, 3];

export function NotificationSkeleton() {
  return (
    <Stack>
      {ROWS.map((row) => (
        <Stack
          key={row}
          direction="row"
          spacing={1.5}
          sx={{ px: 2.5, py: 2, borderBottom: (theme) => hairline(theme) }}
        >
          <Skeleton
            variant="rounded"
            sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: 1.5 }}
          />

          <Stack spacing={0.75} sx={{ flexGrow: 1, pt: 0.25 }}>
            <Skeleton variant="text" sx={{ width: 0.35, height: 12 }} />
            <Skeleton variant="text" sx={{ width: 0.9, height: 14 }} />
            <Skeleton variant="text" sx={{ width: 0.5, height: 12 }} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
