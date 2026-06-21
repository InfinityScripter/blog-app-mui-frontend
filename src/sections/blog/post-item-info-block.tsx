import Stack from "@mui/material/Stack";
import { Iconify } from "src/components/iconify";
import { fShortenNumber } from "src/utils/format-number";

import type { InfoBlockProps } from "./types";

// ----------------------------------------------------------------------

export function InfoBlock({
  totalComments,
  totalViews,
  totalShares,
  readingTime,
  sx,
}: InfoBlockProps) {
  return (
    <Stack
      spacing={1.5}
      direction="row"
      flexWrap="wrap"
      justifyContent="flex-end"
      sx={{
        mt: 3,
        typography: "caption",
        color: "text.disabled",
        ...sx,
      }}
    >
      {readingTime != null && (
        <Stack direction="row" alignItems="center" sx={{ mr: "auto" }}>
          <Iconify icon="solar:clock-circle-bold" width={16} sx={{ mr: 0.5 }} />
          {`${readingTime} мин`}
        </Stack>
      )}

      <Stack direction="row" alignItems="center">
        <Iconify icon="eva:message-circle-fill" width={16} sx={{ mr: 0.5 }} />
        {fShortenNumber(totalComments)}
      </Stack>

      <Stack direction="row" alignItems="center">
        <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 0.5 }} />
        {fShortenNumber(totalViews)}
      </Stack>

      <Stack direction="row" alignItems="center">
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 0.5 }} />
        {fShortenNumber(totalShares)}
      </Stack>
    </Stack>
  );
}
