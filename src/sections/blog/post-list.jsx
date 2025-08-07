import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { useInfiniteScroll } from "src/hooks/use-infinite-scroll";

import { Iconify } from "src/components/iconify";

import { PostItemSkeleton } from "./post-skeleton";
import { PostItem, PostItemLatest } from "./post-item";

// ----------------------------------------------------------------------

export function PostList({ posts, loading: initialLoading }) {
  const { items, hasMore, loading, loadMore } = useInfiniteScroll(posts);

  const renderLoading = (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        md: "repeat(4, 1fr)",
      }}
    >
      <PostItemSkeleton />
    </Box>
  );

  const renderList = (
    <Grid container spacing={3}>
      {items.slice(0, 3).map((post, index) => (
        <Grid
          key={post._id}
          xs={12}
          sm={6}
          md={4}
          lg={index === 0 ? 6 : 3}
          sx={{ display: { xs: "none", lg: "block" } }}
        >
          <PostItemLatest post={post} index={index} />
        </Grid>
      ))}

      {items.slice(0, 3).map((post) => (
        <Grid
          key={post._id}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{ display: { lg: "none" } }}
        >
          <PostItem post={post} />
        </Grid>
      ))}

      {items.slice(3, items.length).map((post) => (
        <Grid key={post._id} xs={12} sm={6} md={4} lg={3}>
          <PostItem post={post} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      {initialLoading ? renderLoading : renderList}

      {hasMore && (
        <Stack alignItems="center" sx={{ mt: 8, mb: { xs: 10, md: 15 } }}>
          <Button
            size="large"
            variant="outlined"
            startIcon={
              <Iconify
                icon={
                  loading
                    ? "svg-spinners:12-dots-scale-rotate"
                    : "eva:arrow-down-outline"
                }
                width={24}
              />
            }
            onClick={loadMore}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </Stack>
      )}
    </>
  );
}
