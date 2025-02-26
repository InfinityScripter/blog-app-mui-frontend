import { useState } from 'react';
import { useParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { deleteComment, updateComment } from 'src/actions/blog-ssr';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';

import { PostCommentForm } from './post-comment-form';

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

  const handleSave = async () => {
    if (editedMessage.trim()) {
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
        popover.onClose();
      } catch (error) {
        console.error('Ошибка обновления комментария:', error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSave();
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    popover.onClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedMessage(message);
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

          {isCommentOwner && !isEditing && (
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          )}
        </Stack>

        {isEditing ? (
          <Stack spacing={2}>
            <TextField
              fullWidth
              multiline
              size="small"
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Press Enter to save or Shift+Enter for new line"
              sx={{ mb: 1 }}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                size="small"
                color="inherit"
                onClick={handleCancelEdit}
                startIcon={<Iconify icon="eva:close-fill" />}
              >
                Cancel
              </Button>
              <Button
                size="small"
                onClick={handleSave}
                startIcon={<Iconify icon="eva:checkmark-fill" />}
                color='success'
              >
                Save
              </Button>
            </Stack>
          </Stack>
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

        {reply.value && (
          <PostCommentForm 
            onCommentUpdated={onCommentUpdated} 
            parentCommentId={comment.id} 
          />
        )}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuItem onClick={handleStartEdit}>
          <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </CustomPopover>
    </Box>
  );
}
