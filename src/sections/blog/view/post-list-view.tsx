"use client";

import type { Post } from "src/types/domain";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Button from "@mui/material/Button";
import { orderBy } from "src/utils/helper";
import { Label } from "src/components/label";
import { useState, useCallback } from "react";
import { POST_SORT_OPTIONS } from "src/_mock";
import { Iconify } from "src/components/iconify";
import { RouterLink } from "src/routes/components";
import { useDebounce } from "src/hooks/use-debounce";
import { useSetState } from "src/hooks/use-set-state";
import { DashboardContent } from "src/layouts/dashboard";
import { useGetPosts, useSearchPosts } from "src/actions/blog";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { PostSort } from "../post-sort";
import { PostSearch } from "../post-search";
import { PostListHorizontal } from "../post-list-horizontal";

// ----------------------------------------------------------------------

export function PostListView() {
  const [sortBy, setSortBy] = useState("latest");

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery);

  const { posts, postsLoading } = useGetPosts();

  const { searchResults, searchLoading } = useSearchPosts(debouncedQuery, true);

  const filters = useSetState({ publish: "all" });

  const dataFiltered = applyFilter({
    inputData: posts,
    filters: filters.state,
    sortBy,
  });

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  const handleFilterPublish = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      filters.setState({ publish: newValue });
    },
    [filters],
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Список"
        links={[
          { name: "Главная", href: paths.dashboard.root },
          { name: "Блог", href: paths.dashboard.post.root },
          { name: "Список" },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Новый пост
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: "flex-end", sm: "center" }}
        direction={{ xs: "column", sm: "row" }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <PostSearch
          query={debouncedQuery}
          results={searchResults}
          onSearch={handleSearch}
          loading={searchLoading}
          hrefItem={(title) => paths.dashboard.post.details(title)}
          dashboard
        />

        <PostSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={POST_SORT_OPTIONS}
        />
      </Stack>

      <Tabs
        value={filters.state.publish}
        onChange={handleFilterPublish}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        {["all", "published", "draft"].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={
                  ((tab === "all" || tab === filters.state.publish) &&
                    "filled") ||
                  "soft"
                }
                color={(tab === "published" && "info") || "default"}
              >
                {tab === "all" && posts.length}

                {tab === "published" &&
                  posts.filter((post) => post.publish === "published").length}

                {tab === "draft" &&
                  posts.filter((post) => post.publish === "draft").length}
              </Label>
            }
            sx={{ textTransform: "capitalize" }}
          />
        ))}
      </Tabs>

      <PostListHorizontal posts={dataFiltered} loading={postsLoading} />
    </DashboardContent>
  );
}

// `orderBy` is constrained to `Record<string, unknown>`; the `Post` interface
// has no index signature, so widen each element with an intersection type
// (via spread, no cast) to satisfy the sort call's generic constraint.
type SortablePost = Post & Record<string, unknown>;

const applyFilter = ({
  inputData,
  filters,
  sortBy,
}: {
  inputData: Post[];
  filters: { publish: string };
  sortBy: string;
}): Post[] => {
  const { publish } = filters;

  let data: SortablePost[] = inputData.map((post) => ({ ...post }));

  if (sortBy === "latest") {
    data = orderBy(data, ["createdAt"], ["desc"]);
  }

  if (sortBy === "oldest") {
    data = orderBy(data, ["createdAt"], ["asc"]);
  }

  if (sortBy === "popular") {
    data = orderBy(data, ["totalViews"], ["desc"]);
  }

  if (publish !== "all") {
    data = data.filter((post) => post.publish === publish);
  }

  return data;
};
