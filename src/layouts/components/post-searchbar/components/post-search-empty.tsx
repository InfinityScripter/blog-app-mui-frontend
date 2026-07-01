import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useGetPosts } from "src/actions/blog";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import { PostResultItem } from "./post-result-item";

import type { PostSearchEmptyProps } from "../types";

// ----------------------------------------------------------------------

const RECENT_COUNT = 6;

// Zero-state for the cmd+k dialog: before the visitor types anything, surface
// the latest posts as quick links so the panel is never blank. `limit` makes
// the backend return newest-first (see useGetPosts), so no client sort needed.
export function PostSearchEmpty({ onClickItem }: PostSearchEmptyProps) {
  const { posts, postsLoading } = useGetPosts({
    excludeTag: "новости",
    limit: RECENT_COUNT,
  });

  return (
    <Box>
      <Typography
        variant="overline"
        sx={{
          px: 1,
          mb: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          color: "text.secondary",
        }}
      >
        <Iconify icon="solar:clock-circle-outline" width={16} />
        Свежие статьи
      </Typography>

      {postsLoading ? (
        <Box>
          {Array.from({ length: 4 }).map((_, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1 }}
            >
              <Skeleton variant="rounded" width={48} height={48} />
              <Skeleton variant="text" sx={{ flexGrow: 1, maxWidth: 320 }} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box component="ul">
          {posts.map((post) => (
            <Box component="li" key={post._id} sx={{ display: "flex" }}>
              <PostResultItem
                post={post}
                query=""
                onClickItem={() => onClickItem(String(post._id))}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
