import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

import { PostDetailsSkeleton } from "./post-details-skeleton";

import type { PostItemSkeletonProps } from "./types";

// Re-exported so existing importers keep
// `import { PostDetailsSkeleton } from "src/sections/blog/post-skeleton"`.
export { PostDetailsSkeleton };

// ----------------------------------------------------------------------

export function PostItemSkeleton({
  sx,
  amount = 16,
  variant = "vertical",
  ...other
}: PostItemSkeletonProps) {
  if (variant === "horizontal") {
    return [...Array(amount)].map((_, index) => (
      <Stack
        key={index}
        direction="row"
        sx={{
          borderRadius: 2,
          bgcolor: "background.paper",
          border: `solid 1px var(--palette-divider)`,
          ...sx,
        }}
        {...other}
      >
        <Stack spacing={2} flexGrow={1} sx={{ p: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
            <Skeleton sx={{ width: 24, height: 12 }} />
          </Stack>

          <Skeleton sx={{ width: 1, height: 10 }} />
          <Skeleton sx={{ width: `calc(100% - 40px)`, height: 10 }} />
          <Skeleton sx={{ width: `calc(100% - 80px)`, height: 10 }} />
        </Stack>

        <Stack
          sx={{
            p: 1,
            display: {
              xs: "none",
              sm: "flex",
            },
          }}
        >
          <Skeleton sx={{ width: 170, height: 240, flexShrink: 0 }} />
        </Stack>
      </Stack>
    ));
  }

  return [...Array(amount)].map((_, index) => (
    <Stack
      key={index}
      sx={{
        borderRadius: 2,
        bgcolor: "background.paper",
        border: `solid 1px var(--palette-divider)`,
        ...sx,
      }}
      {...other}
    >
      <Stack sx={{ p: 1 }}>
        <Skeleton sx={{ pt: "100%" }} />
      </Stack>

      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        sx={{ p: 3, pt: 2 }}
      >
        <Skeleton
          variant="circular"
          sx={{ width: 40, height: 40, flexShrink: 0 }}
        />
        <Stack flexGrow={1} spacing={1}>
          <Skeleton sx={{ height: 10 }} />
          <Skeleton sx={{ width: 0.5, height: 10 }} />
        </Stack>
      </Stack>
    </Stack>
  ));
}
