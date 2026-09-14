"use client";

import type { Post } from "src/types/domain";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Avatar from "@mui/material/Avatar";
import { maxLine } from "src/theme/styles";
import { useTranslations } from "next-intl";
import { useRouter } from "src/routes/hooks";
import { Label } from "src/components/label";
import { Image } from "src/components/image";
import { fDate } from "src/utils/format-time";
import { coverSrc } from "src/utils/cover-src";
import { useTheme } from "@mui/material/styles";
import { Iconify } from "src/components/iconify";
import { PUBLISH_STATUS } from "src/types/domain";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { getReadingTime } from "src/utils/reading-time";
import { usePostDelete } from "src/hooks/use-post-delete";
import { usePopover } from "src/components/custom-popover";
import { ConfirmDialog } from "src/components/confirm-dialog";

import { MAX_TAGS } from "./const";
import { PostItemHorizontalMenu } from "./post-item-horizontal-menu";
import { PostItemHorizontalStats } from "./post-item-horizontal-stats";
import { usePublishStatusLabel } from "./hooks/use-publish-status-label";

// ----------------------------------------------------------------------

export function PostItemHorizontal({ post }: { post: Post }) {
  const theme = useTheme();
  const t = useTranslations("blog");
  const statusLabel = usePublishStatusLabel();
  const popover = usePopover();
  const router = useRouter();
  const {
    openConfirm,
    loading,
    handleOpenConfirm,
    handleCloseConfirm,
    handleDelete,
  } = usePostDelete();

  const {
    title,
    author,
    publish,
    coverUrl,
    createdAt,
    totalViews,
    totalShares,
    totalComments,
    description,
    tags,
  } = post;

  const visibleTags = (tags ?? []).slice(0, MAX_TAGS);
  const readingTime = post.readingTime ?? getReadingTime(post.content);

  const handleEdit = () => {
    router.push(paths.dashboard.post.edit(String(post._id)));
    popover.onClose();
  };

  const handleView = () => {
    popover.onClose();
    router.push(paths.dashboard.post.details(String(post._id)));
  };

  const handleClickDelete = () => {
    if (post._id) {
      handleOpenConfirm({ ...post, _id: post._id });
    }
    popover.onClose();
  };

  return (
    <>
      <Card sx={{ display: "flex" }}>
        <Stack spacing={1} sx={{ p: theme.spacing(3, 3, 2, 3) }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Label
              variant="soft"
              color={
                (publish === PUBLISH_STATUS.published && "info") || "default"
              }
            >
              {statusLabel(publish)}
            </Label>

            <Box
              component="span"
              sx={{ typography: "caption", color: "text.disabled" }}
            >
              {fDate(createdAt)}
            </Box>
          </Box>

          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Link
              component={RouterLink}
              href={paths.dashboard.post.details(String(post._id))}
              color="inherit"
              variant="subtitle2"
              sx={{ ...maxLine({ line: 2 }) }}
            >
              {title}
            </Link>

            <Typography
              variant="body2"
              sx={{ ...maxLine({ line: 2 }), color: "text.secondary" }}
            >
              {description}
            </Typography>

            {visibleTags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {visibleTags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="soft" />
                ))}
              </Box>
            )}
          </Stack>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color={popover.open ? "inherit" : "default"}
              onClick={popover.onOpen}
            >
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>

            <PostItemHorizontalStats
              readingTime={readingTime}
              totalComments={totalComments}
              totalViews={totalViews}
              totalShares={totalShares}
            />
          </Box>
        </Stack>

        <Box
          sx={{
            p: 1,
            width: 180,
            height: 240,
            flexShrink: 0,
            position: "relative",
            display: { xs: "none", sm: "block" },
          }}
        >
          <Avatar
            alt={author?.name}
            src={author?.avatarUrl}
            sx={{ top: 16, right: 16, zIndex: 9, position: "absolute" }}
          />
          <Image
            alt={title}
            src={coverSrc(coverUrl)}
            sx={{ height: 1, borderRadius: 1.5 }}
          />
        </Box>

        <PostItemHorizontalMenu
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleClickDelete}
        />
      </Card>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={t("toolbar.deleteTitle")}
        content={t("toolbar.deleteContent")}
        onConfirm={handleDelete}
        loading={loading}
        confirmText={t("toolbar.deleteConfirm")}
        confirmColor="error"
      />
    </>
  );
}
