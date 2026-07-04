"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { useState, useCallback } from "react";
import { monoLabelSx } from "src/theme/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useSearchPosts } from "src/actions/blog";
import { useDebounce } from "src/hooks/use-debounce";
import { POST_SORT_OPTIONS } from "src/sections/blog/const";
import { toggleTag, useFeedTags } from "src/sections/home/home-feed";

import { PostList } from "../post-list";
import { PostSort } from "../post-sort";
import { applyHomeFilter } from "./utils";
import { PostSearch } from "../post-search";

import type { PostListHomeViewProps } from "./types";

// ----------------------------------------------------------------------

export function PostListHomeView({ posts }: PostListHomeViewProps) {
  const [sortBy, setSortBy] = useState("latest");

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const feedTags = useFeedTags(posts, { pinned: selectedTags });

  const debouncedQuery = useDebounce(searchQuery);

  const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);

  const dataFiltered = applyHomeFilter({
    inputData: posts,
    sortBy,
    selectedTags,
  });

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => toggleTag(prev, tag));
  }, []);

  return (
    <Container>
      <Stack spacing={1} sx={{ my: { xs: 3, md: 5 } }}>
        <Typography component="p" sx={monoLabelSx}>
          Разборы и заметки
        </Typography>
        <Typography variant="h2" component="h1">
          Блог
        </Typography>
      </Stack>

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: "flex-end", sm: "center" }}
        direction={{ xs: "column", sm: "row" }}
        sx={{ mb: 3 }}
      >
        <PostSearch
          query={debouncedQuery}
          results={searchResults}
          onSearch={handleSearch}
          loading={searchLoading}
          hrefItem={(title) => paths.post.details(title)}
        />

        <PostSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={POST_SORT_OPTIONS}
        />
      </Stack>

      {feedTags.length > 0 && (
        <Box
          sx={{
            mb: { xs: 3, md: 5 },
            gap: 1,
            display: "flex",
            flexWrap: { xs: "nowrap", sm: "wrap" },
            overflowX: { xs: "auto", sm: "visible" },
            pb: { xs: 1, sm: 0 },
          }}
        >
          {feedTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <Chip
                key={tag}
                label={tag}
                clickable
                onClick={() => handleToggleTag(tag)}
                color={active ? "primary" : "default"}
                variant={active ? "filled" : "outlined"}
                sx={{ flexShrink: 0, minHeight: 44 }}
              />
            );
          })}
        </Box>
      )}

      <PostList posts={dataFiltered} activeTags={selectedTags} />
    </Container>
  );
}
