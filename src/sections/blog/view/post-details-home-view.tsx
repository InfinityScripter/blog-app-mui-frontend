"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Avatar from "@mui/material/Avatar";
import { CONFIG } from "src/config-global";
import Divider from "@mui/material/Divider";
import { useTranslations } from "next-intl";
import { useGetPost } from "src/actions/blog";
import { fDate } from "src/utils/format-time";
import { monoValueSx } from "src/theme/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { Markdown } from "src/components/markdown";
import { RouterLink } from "src/routes/components";
import AvatarGroup from "@mui/material/AvatarGroup";
import { usePostView } from "src/hooks/use-post-view";
import { getReadingTime } from "src/utils/reading-time";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import {
  parsePostContent,
  isMeaningfullyUpdated,
} from "src/utils/post-geo-content";

import { PostFaq } from "../post-faq";
import { PostItem } from "../post-item";
import { PostBluf } from "../post-bluf";
import { PostRelated } from "../post-related";
import { PostCommentList } from "../post-comment-list";
import { PostCommentForm } from "../post-comment-form";
import { PostDetailsHero } from "../post-details-hero";
import { PostTelegramCta } from "../post-telegram-cta";
import { PostNewsletterCta } from "../post-newsletter-cta";

import type { PostDetailsHomeViewProps } from "./types";

// ----------------------------------------------------------------------

export function PostDetailsHomeView({
  post: initialPost,
  latestPosts,
}: PostDetailsHomeViewProps) {
  const t = useTranslations("blog");
  const { post, postMutate } = useGetPost(initialPost?._id);
  const currentPost = post || initialPost;

  usePostView(currentPost?._id);

  const readingTime = getReadingTime(currentPost?.content);
  // Split the `## FAQ` section out of the body: `body` renders as the article,
  // `faq` drives the accordion (so questions aren't duplicated inline).
  const { body, faq } = parsePostContent(currentPost?.content);
  const showUpdated = isMeaningfullyUpdated(
    currentPost?.createdAt,
    currentPost?.updatedAt,
  );

  return (
    <>
      <PostDetailsHero
        title={currentPost?.title ?? ""}
        author={currentPost?.author}
        coverUrl={currentPost?.coverUrl ?? ""}
        createdAt={currentPost?.createdAt}
        postId={currentPost?._id}
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
            { name: t("breadcrumbs.home"), href: "/" },
            { name: t("breadcrumbs.blog"), href: paths.post.root },
            { name: currentPost?.title },
          ]}
          sx={{ maxWidth: 720, mx: "auto" }}
        />
      </Container>

      <Container maxWidth={false}>
        <Stack sx={{ maxWidth: 720, mx: "auto" }}>
          <Box
            sx={{
              ...monoValueSx,
              mb: 2,
              gap: 1,
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <Box sx={{ gap: 0.5, display: "flex", alignItems: "center" }}>
              <Iconify icon="solar:clock-circle-bold" width={16} />
              {t("readingTimeLong", { minutes: readingTime })}
            </Box>
            {showUpdated && (
              <>
                <Box
                  sx={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    bgcolor: "text.disabled",
                  }}
                />
                <Box component="span" sx={{ color: "primary.main" }}>
                  {t("updatedAt", {
                    date: fDate(currentPost?.updatedAt) ?? "",
                  })}
                </Box>
              </>
            )}
          </Box>

          <PostBluf text={currentPost?.description} />

          {body.trim() ? (
            <Markdown children={body} />
          ) : (
            <Typography
              variant="body2"
              sx={{ py: 3, color: "text.disabled", fontStyle: "italic" }}
            >
              {t("list.empty")}
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
                <Chip
                  key={tag}
                  label={tag}
                  variant="outlined"
                  clickable
                  component={RouterLink}
                  href={paths.tag.details(tag)}
                />
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

          <PostFaq items={faq} />

          {/* Email capture (double-opt-in) — collects PD, so gated. */}
          {CONFIG.features.pdCollection && <PostNewsletterCta />}

          <PostTelegramCta />

          <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
            <Typography variant="h4">{t("comments.title")}</Typography>

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
            {t("list.latestPosts")}
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
