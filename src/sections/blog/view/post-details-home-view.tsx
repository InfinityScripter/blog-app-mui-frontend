"use client";

import type { Post } from "src/types/domain";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { useGetPost } from "src/actions/blog";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { Markdown } from "src/components/markdown";
import AvatarGroup from "@mui/material/AvatarGroup";
import { usePostView } from "src/hooks/use-post-view";
import { getReadingTime } from "src/utils/reading-time";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { PostItem } from "../post-item";
import { PostRelated } from "../post-related";
import { PostCommentList } from "../post-comment-list";
import { PostCommentForm } from "../post-comment-form";
import { PostDetailsHero } from "../post-details-hero";

// ----------------------------------------------------------------------

interface PostDetailsHomeViewProps {
  post?: Post;
  latestPosts?: Post[];
}

export function PostDetailsHomeView({
  post: initialPost,
  latestPosts,
}: PostDetailsHomeViewProps) {
  const { post, postMutate } = useGetPost(initialPost?._id);
  const currentPost = post || initialPost;

  usePostView(currentPost?._id);

  const readingTime = getReadingTime(currentPost?.content);

  return (
    <>
      <PostDetailsHero
        title={currentPost?.title ?? ""}
        author={currentPost?.author}
        coverUrl={currentPost?.coverUrl ?? ""}
        createdAt={currentPost?.createdAt}
      />

      <Container
        maxWidth={false}
        sx={{
          py: 3,
          mb: 5,
          borderBottom: `solid 1px var(--palette-divider)`,
        }}
      >
        <CustomBreadcrumbs
          links={[
            { name: "Главная", href: "/" },
            { name: "Блог", href: paths.post.root },
            { name: currentPost?.title },
          ]}
          sx={{ maxWidth: 720, mx: "auto" }}
        />
      </Container>

      <Container maxWidth={false}>
        <Stack sx={{ maxWidth: 720, mx: "auto" }}>
          <Box
            sx={{
              mb: 2,
              gap: 0.5,
              display: "flex",
              alignItems: "center",
              typography: "body2",
              color: "text.secondary",
            }}
          >
            <Iconify icon="solar:clock-circle-bold" width={18} />
            {`${readingTime} мин чтения`}
          </Box>

          <Typography variant="subtitle1">
            {currentPost?.description}
          </Typography>

          {currentPost?.content?.trim() ? (
            <Markdown children={currentPost.content} />
          ) : (
            <Typography
              variant="body2"
              sx={{ py: 3, color: "text.disabled", fontStyle: "italic" }}
            >
              У этого поста пока нет содержимого.
            </Typography>
          )}

          <Stack
            spacing={3}
            sx={{
              py: 3,
              borderTop: `dashed 1px var(--palette-divider)`,
              borderBottom: `dashed 1px var(--palette-divider)`,
            }}
          >
            <Stack direction="row" flexWrap="wrap" spacing={1}>
              {currentPost?.tags.map((tag) => (
                <Chip key={tag} label={tag} variant="soft" />
              ))}
            </Stack>

            <Stack direction="row" alignItems="center">
              <AvatarGroup>
                {currentPost?.favoritePerson.map((person) => (
                  <Avatar
                    key={person.name}
                    alt={person.name}
                    src={person.avatarUrl}
                  />
                ))}
              </AvatarGroup>
            </Stack>
          </Stack>

          <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
            <Typography variant="h4">Комментарии</Typography>

            <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
              ({currentPost?.comments.length})
            </Typography>
          </Stack>

          <PostCommentForm
            postId={currentPost?._id}
            onCommentUpdated={postMutate}
          />

          <Divider sx={{ mt: 5, mb: 2 }} />

          <PostCommentList
            comments={currentPost?.comments}
            postId={currentPost?._id}
            onCommentUpdated={postMutate}
          />
        </Stack>
      </Container>

      <PostRelated
        currentPostId={currentPost?._id}
        tags={currentPost?.tags ?? []}
      />

      {!!latestPosts?.length && (
        <Container sx={{ pb: 15 }}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Свежие посты
          </Typography>

          <Grid container spacing={3}>
            {latestPosts?.slice(latestPosts.length - 4).map((latestPost) => (
              <Grid key={latestPost.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <PostItem post={latestPost} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
}
