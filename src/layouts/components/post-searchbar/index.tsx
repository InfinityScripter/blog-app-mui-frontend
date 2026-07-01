"use client";

import Box from "@mui/material/Box";
import { paths } from "src/routes/paths";
// NOTE: crossing the sections-isolation convention (not eslint-enforced) with a
// single import of PostSearch into layouts — documented decision, no file moves.
import { PostSearch } from "src/sections/blog/post-search";

import { usePostSearch } from "./hooks/use-post-search";

// ----------------------------------------------------------------------

// Public post-search entry hoisted into the shared header. Constrained width
// and hidden below md so it never overflows the mobile header.
export function PostSearchbar() {
  const { query, results, loading, onSearch } = usePostSearch();

  return (
    <Box
      sx={{
        mr: 2.5,
        width: 240,
        display: { xs: "none", md: "block" },
      }}
    >
      <PostSearch
        query={query}
        results={results}
        onSearch={onSearch}
        loading={loading}
        hrefItem={(id) => paths.post.details(id)}
      />
    </Box>
  );
}
