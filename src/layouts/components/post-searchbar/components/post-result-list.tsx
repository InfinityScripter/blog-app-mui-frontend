import Box from "@mui/material/Box";

import { PostResultItem } from "./post-result-item";

import type { PostResultListProps } from "../types";

// ----------------------------------------------------------------------

export function PostResultList({
  results,
  query,
  onClickItem,
}: PostResultListProps) {
  return (
    <Box component="ul">
      {results.map((post) => (
        <Box component="li" key={post._id} sx={{ display: "flex" }}>
          <PostResultItem
            post={post}
            query={query}
            onClickItem={() => onClickItem(String(post._id))}
          />
        </Box>
      ))}
    </Box>
  );
}
