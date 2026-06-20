"use client";

import type { Post } from "src/types/domain";
import type { FeedTag } from "src/sections/home/home-feed/const";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { orderBy } from "src/utils/helper";
import { useState, useCallback } from "react";
import { POST_SORT_OPTIONS } from "src/_mock";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useSearchPosts } from "src/actions/blog";
import { useDebounce } from "src/hooks/use-debounce";
import { FEED_TAGS } from "src/sections/home/home-feed/const";
import { toggleTag } from "src/sections/home/home-feed/utils";

import { PostList } from "../post-list";
import { PostSort } from "../post-sort";
import { PostSearch } from "../post-search";

// ----------------------------------------------------------------------

interface PostListHomeViewProps {
  posts: Post[];
}

export function PostListHomeView({ posts }: PostListHomeViewProps) {
  const [sortBy, setSortBy] = useState("latest");

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTags, setSelectedTags] = useState<FeedTag[]>([]);

  const debouncedQuery = useDebounce(searchQuery);

  const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);

  const dataFiltered = applyFilter({ inputData: posts, sortBy, selectedTags });

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  const handleToggleTag = useCallback((tag: FeedTag) => {
    setSelectedTags((prev) => toggleTag(prev, tag, FEED_TAGS));
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Блог
      </Typography>

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
        {FEED_TAGS.map((tag) => {
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

      <PostList posts={dataFiltered} />
    </Container>
  );
}

// `orderBy` is constrained to `Record<string, unknown>`; the `Post` interface
// has no index signature, so widen each element with an intersection type
// (via spread, no cast) to satisfy the sort call's generic constraint.
type SortablePost = Post & Record<string, unknown>;

const applyFilter = ({
  inputData,
  sortBy,
  selectedTags,
}: {
  inputData: Post[];
  sortBy: string;
  selectedTags: FeedTag[];
}): Post[] => {
  let publishedPosts: SortablePost[] = inputData
    .filter((post) => post.publish === "published")
    .map((post) => ({ ...post }));

  if (selectedTags.length > 0) {
    publishedPosts = publishedPosts.filter((post) =>
      selectedTags.some((tag) =>
        (post.tags ?? []).some(
          (t) => t.toLowerCase().trim() === tag.toLowerCase().trim(),
        ),
      ),
    );
  }

  if (sortBy === "latest") {
    return orderBy(publishedPosts, ["createdAt"], ["desc"]);
  }
  if (sortBy === "oldest") {
    return orderBy(publishedPosts, ["createdAt"], ["asc"]);
  }
  if (sortBy === "popular") {
    return orderBy(publishedPosts, ["totalViews"], ["desc"]);
  }
  return publishedPosts;
};
