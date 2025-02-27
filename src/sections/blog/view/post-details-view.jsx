"use client";

import { useCallback, useEffect, useState } from "react";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AvatarGroup, { avatarGroupClasses } from "@mui/material/AvatarGroup";

import { paths } from "src/routes/paths";

import { useGetPost } from "src/actions/blog";
import { POST_PUBLISH_OPTIONS } from "src/_mock";
import { DashboardContent } from "src/layouts/dashboard";
import { updatePostPublish } from "src/actions/blog-ssr";

import { Markdown } from "src/components/markdown";

import { PostDetailsHero } from "../post-details-hero";
import { PostCommentList } from "../post-comment-list";
import { PostCommentForm } from "../post-comment-form";
import { PostDetailsToolbar } from "../post-details-toolbar";
import { formatImageUrl } from "../../../utils/format-image-url";

// ----------------------------------------------------------------------

export function PostDetailsView({ initialPost }) {
  const [publish, setPublish] = useState("");

  const { post } = useGetPost(initialPost?._id);
  const currentPost = post || initialPost;

  const handleChangePublish = useCallback(
    async (newValue) => {
      try {
        await updatePostPublish(currentPost._id, newValue);
        setPublish(newValue);
      } catch (error) {
        console.error("Failed to update publish status:", error);
      }
    },
    [currentPost._id],
  );

  useEffect(() => {
    if (currentPost) {
      setPublish(currentPost?.publish);
    }
  }, [currentPost]);

  return (
    <DashboardContent maxWidth={false} disablePadding>
      <Container maxWidth={false} sx={{ px: { sm: 5 } }}>
        <PostDetailsToolbar
          backLink={paths.dashboard.post.root}
          editLink={paths.dashboard.post.edit(`${currentPost?._id}`)}
          liveLink={paths.post.details(`${currentPost?._id}`)}
          publish={`${publish}`}
          onChangePublish={handleChangePublish}
          publishOptions={POST_PUBLISH_OPTIONS}
          postId={currentPost._id}
        />
      </Container>

      <PostDetailsHero
        title={`${currentPost?.title}`}
        coverUrl={`${formatImageUrl(currentPost?.coverUrl)}`}
      />

      <Stack
        sx={{
          pb: 5,
          mx: "auto",
          maxWidth: 720,
          mt: { xs: 5, md: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="subtitle1">{currentPost?.description}</Typography>

        <Markdown children={currentPost?.content} />

        <Stack
          spacing={3}
          sx={{
            py: 3,
            borderTop: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
            borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
          }}
        >
          <Stack direction="row" flexWrap="wrap" spacing={1}>
            {currentPost?.tags.map((tag) => (
              <Chip key={tag} label={tag} variant="soft" />
            ))}
          </Stack>

          <Stack direction="row" alignItems="center">
            <AvatarGroup
              sx={{
                [`& .${avatarGroupClasses.avatar}`]: { width: 32, height: 32 },
              }}
            >
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
          comments={currentPost?.comments ?? []}
          postId={currentPost?._id}
        />
      </Stack>
    </DashboardContent>
  );
}
