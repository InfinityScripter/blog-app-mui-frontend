import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useParams } from 'next/navigation';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { deleteComment, updateComment } from 'src/actions/blog-ssr';
import { PostCommentForm } from './post-comment-form';
import { endpoints } from '../../utils/axios';

export default function PostCommentItem({
  name,
  avatarUrl,
  message,
  tagUser,
  postedAt,
  hasReply,
  comment,
  parentCommentId,
  onCommentUpdated,
}) {
  const reply = useBoolean();
  const { user } = useAuthContext();
  const params = useParams();
  const postId = params?.id;
  const popover = usePopover();

  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const postCacheKey = `${endpoints.post.details}?id=${postId}`;

  const handleEdit = async () => {
    if (isEditing && editedMessage.trim()) {
      try {
        await updateComment(postId, comment.id, {
          message: editedMessage,
          isReply: hasReply,
          parentCommentId,
        });

        if (onCommentUpdated) {
          onCommentUpdated();
        }
        setIsEditing(false);
      } catch (error) {
        console.error('Ошибка обновления комментария:', error);
      }
    } else {
      setIsEditing(true);
    }
    popover.onClose();
  };

  const handleDelete = async () => {
    try {
      await deleteComment(postId, comment.id, {
        isReply: hasReply,
        parentCommentId,
      });

      if (onCommentUpdated) {
        onCommentUpdated();
      }
    } catch (error) {
      console.error('Ошибка удаления комментария:', error);
    }

    popover.onClose();
  };

  const isCommentOwner = user?._id && comment.userId && String(user._id) === String(comment.userId);

  return (
    <Box
      sx={{
        pt: 3,
        display: 'flex',
        position: 'relative',
        ...(hasReply && { pl: 8 }),
      }}
    >
      <Avatar alt={name} src={avatarUrl} sx={{ mr: 2, width: 48, height: 48 }} />

      <Stack flexGrow={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {name}
            {tagUser && (
              <Box component="span" sx={{ typography: 'subtitle2', color: 'primary.main' }}>
                {tagUser}
              </Box>
            )}
          </Typography>

          {isCommentOwner && (
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          )}
        </Stack>

        {isEditing ? (
          <TextField
            fullWidth
            multiline
            size="small"
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            sx={{ mb: 2 }}
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
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {fDate(postedAt)}
          </Typography>

          {!hasReply && (
            <Button
              size="small"
              variant="text"
              onClick={reply.onTrue}
              sx={{ color: 'text.disabled' }}
              startIcon={<Iconify icon="solar:reply-bold" width={24} />}
            >
              Reply
            </Button>
          )}
        </Stack>

        {reply.value && <PostCommentForm onCommentUpdated={onCommentUpdated} />}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuItem
          onClick={handleEdit}
          sx={{ color: isEditing ? 'success.main' : 'text.primary' }}
        >
          <Iconify
            icon={isEditing ? 'eva:checkmark-fill' : 'solar:pen-bold'}
            sx={{ mr: 1 }}
          />
          {isEditing ? 'Save' : 'Edit'}
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </CustomPopover>
    </Box>
  );
}
