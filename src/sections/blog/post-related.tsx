import Grid from "@mui/material/Grid";
import { useGetPosts } from "src/actions/blog";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { PostItem } from "./post-item";
import { selectRelated } from "./utils";

import type { PostRelatedProps } from "./types";

// ----------------------------------------------------------------------

export function PostRelated({ currentPostId, tags }: PostRelatedProps) {
  const { posts } = useGetPosts();

  const related = selectRelated(posts, currentPostId, tags);

  if (related.length === 0) {
    return null;
  }

  return (
    <Container sx={{ pb: 10 }}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Похожие посты
      </Typography>

      <Grid container spacing={3}>
        {related.map((post) => (
          <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <PostItem post={post} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
