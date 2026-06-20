import type { Post } from "src/types/domain";

import Grid from "@mui/material/Grid";
import { useGetPosts } from "src/actions/blog";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { PostItem } from "./post-item";

// ----------------------------------------------------------------------

const MAX_RELATED = 3;

type PostRelatedProps = {
  currentPostId?: string;
  tags: string[];
};

/** Lowercased, trimmed tag set for overlap comparison. */
function normalizeTags(tags: string[] = []): Set<string> {
  return new Set(tags.map((t) => t.toLowerCase().trim()));
}

/**
 * Picks up to 3 published posts sharing the most tags with the current one,
 * excluding the current post. Falls back to newest posts when nothing overlaps
 * so the block is never empty when other posts exist.
 */
function selectRelated(
  posts: Post[],
  currentPostId: string | undefined,
  tags: string[],
): Post[] {
  const currentTags = normalizeTags(tags);

  const candidates = posts.filter(
    (post) => post.publish === "published" && post.id !== currentPostId,
  );

  const scored = candidates
    .map((post) => {
      const overlap = Array.from(normalizeTags(post.tags)).filter((t) =>
        currentTags.has(t),
      ).length;
      return { post, overlap };
    })
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      const aTime = a.post.createdAt ? new Date(a.post.createdAt).getTime() : 0;
      const bTime = b.post.createdAt ? new Date(b.post.createdAt).getTime() : 0;
      return bTime - aTime;
    });

  return scored.slice(0, MAX_RELATED).map((s) => s.post);
}

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
