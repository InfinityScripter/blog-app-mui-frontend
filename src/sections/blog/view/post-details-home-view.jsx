"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import AvatarGroup from "@mui/material/AvatarGroup";

import { paths } from "src/routes/paths";

import { useGetPost } from "src/actions/blog";

import { Markdown } from "src/components/markdown";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { PostItem } from "../post-item";
import { PostCommentList } from "../post-comment-list";
import { PostCommentForm } from "../post-comment-form";
import { PostDetailsHero } from "../post-details-hero";

// ----------------------------------------------------------------------

export function PostDetailsHomeView({ post: initialPost, latestPosts }) {
  const { post } = useGetPost(initialPost?._id);
  const currentPost = post || initialPost;
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
          borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <CustomBreadcrumbs
          links={[
            { name: "Home", href: "/" },
            { name: "Blog", href: paths.post.root },
            { name: currentPost?.title },
          ]}
          sx={{ maxWidth: 720, mx: "auto" }}
        />
      </Container>

      <Container maxWidth={false}>
        <Stack sx={{ maxWidth: 720, mx: "auto" }}>
          <Typography variant="subtitle1">
            {currentPost?.description}
          </Typography>

          <Markdown children={currentPost?.content} />

          <Stack
            spacing={3}
            sx={{
              py: 3,
              borderTop: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              borderBottom: (theme) =>
                `dashed 1px ${theme.vars.palette.divider}`,
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
            <Typography variant="h4">Comments</Typography>

            <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
              ({currentPost?.comments.length})
            </Typography>
          </Stack>

          <PostCommentForm postId={currentPost?._id} />

          <Divider sx={{ mt: 5, mb: 2 }} />

          <PostCommentList
            comments={currentPost?.comments}
            postId={currentPost?._id}
          />
        </Stack>
      </Container>

      {!!latestPosts?.length && (
        <Container sx={{ pb: 15 }}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Recent Posts
          </Typography>

          <Grid container spacing={3}>
            {latestPosts?.slice(latestPosts.length - 4).map((latestPost) => (
              <Grid key={latestPost.id} xs={12} sm={6} md={4} lg={3}>
                <PostItem post={latestPost} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
}
