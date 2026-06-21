import type { Comment, ReplyComment } from "src/types/domain";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { fDate } from "src/utils/format-time";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useBoolean } from "src/hooks/use-boolean";
import { useAuthContext } from "src/auth/hooks/use-auth-context";

import { PostCommentEdit } from "./post-comment-edit";
import { PostCommentForm } from "./post-comment-form";
import { PostCommentMenu } from "./post-comment-menu";
import { usePostCommentItem } from "./hooks/use-post-comment-item";

interface PostCommentItemProps {
  name: string;
  avatarUrl?: string;
  message: string;
  tagUser?: string;
  postedAt: string | Date;
  hasReply?: boolean;
  comment: Comment | ReplyComment;
  postId?: string;
  parentCommentId?: string;
  onCommentUpdated?: () => void;
}

export default function PostCommentItem({
  name,
  avatarUrl,
  message,
  tagUser,
  postedAt,
  hasReply,
  comment,
  postId: propPostId,
  parentCommentId,
  onCommentUpdated,
}: PostCommentItemProps) {
  const reply = useBoolean();
  const { user } = useAuthContext();

  const {
    popover,
    saving,
    deleting,
    isEditing,
    editedMessage,
    setEditedMessage,
    handleSave,
    handleKeyPress,
    handleStartEdit,
    handleCancelEdit,
    handleDelete,
  } = usePostCommentItem({
    message,
    hasReply,
    comment,
    postId: propPostId,
    parentCommentId,
    onCommentUpdated,
  });

  const isCommentOwner =
    user?._id && comment.userId && String(user._id) === String(comment.userId);

  return (
    <Box
      sx={{
        pt: 3,
        display: "flex",
        position: "relative",
        ...(hasReply && { pl: 8 }),
      }}
    >
      <Avatar
        alt={name}
        src={avatarUrl}
        sx={{ mr: 2, width: 48, height: 48 }}
      />

      <Stack flexGrow={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {name}
            {tagUser && (
              <Box
                component="span"
                sx={{ typography: "subtitle2", color: "primary.main" }}
              >
                {tagUser}
              </Box>
            )}
          </Typography>

          {isCommentOwner && !isEditing && (
            <IconButton
              color={popover.open ? "inherit" : "default"}
              onClick={popover.onOpen}
            >
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          )}
        </Stack>

        {isEditing ? (
          <PostCommentEdit
            value={editedMessage}
            saving={saving.value}
            onChange={setEditedMessage}
            onKeyPress={handleKeyPress}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{
              mb: 1,
            }}
          >
            {message}
          </Typography>
        )}

        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {fDate(postedAt)}
          </Typography>

          {!hasReply && (
            <Button
              size="small"
              variant="text"
              onClick={reply.onTrue}
              sx={{ color: "text.disabled" }}
              startIcon={<Iconify icon="solar:reply-bold" width={24} />}
            >
              Ответить
            </Button>
          )}
        </Stack>

        {reply.value && (
          <PostCommentForm
            onCommentUpdated={onCommentUpdated}
            parentCommentId={comment.id}
          />
        )}
      </Stack>

      <PostCommentMenu
        open={popover.open}
        anchorEl={popover.anchorEl}
        deleting={deleting.value}
        onClose={popover.onClose}
        onEdit={handleStartEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
}
