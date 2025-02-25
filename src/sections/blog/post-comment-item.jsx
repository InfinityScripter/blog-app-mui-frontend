import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { useParams } from 'next/navigation';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { updateComment, deleteComment } from 'src/actions/blog-ssr';
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
  const PostId = params?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    if (isEditing && editedMessage.trim()) {
      console.log('Сохранение отредактированного комментария. PostId:', PostId, 'comment id:', comment.id);
      try {
        setIsLoading(true);
        await updateComment(PostId, comment.id, {
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
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Переключение в режим редактирования');
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    console.log('Удаление комментария. PostId:', PostId, 'comment id:', comment.id);
    try {
      setIsLoading(true);
      await deleteComment(PostId, comment.id, {
        isReply: hasReply,
        parentCommentId,
      });
      if (onCommentUpdated) {
        onCommentUpdated();
      }
    } catch (error) {
      console.error('Ошибка удаления комментария:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const isCommentOwner =
    user?._id && comment.userId && String(user._id) === String(comment.userId);

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

      <Stack
        flexGrow={1}
        sx={{
          pb: 3,
          borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {fDate(postedAt)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {tagUser && (
            <Box component="strong" sx={{ mr: 0.5 }}>
              @{tagUser}
            </Box>
          )}
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              size="small"
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              sx={{ mt: 1 }}
            />
          ) : (
            message
          )}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
          {!hasReply && (
            <Button
              size="small"
              color="inherit"
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={reply.onTrue}
            >
              Reply
            </Button>
          )}
          {isCommentOwner && (
            <>
              <LoadingButton
                size="small"
                color={isEditing ? 'primary' : 'inherit'}
                startIcon={<Iconify icon={isEditing ? 'solar:disk-bold' : 'solar:pen-bold'} />}
                onClick={handleEdit}
                loading={isLoading && isEditing}
              >
                {isEditing ? 'Save' : 'Edit'}
              </LoadingButton>
              <LoadingButton
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={handleDelete}
                loading={isLoading && !isEditing}
              >
                Delete
              </LoadingButton>
            </>
          )}
        </Stack>

        {reply.value && <PostCommentForm hasReply onClose={reply.onFalse} />}
      </Stack>
    </Box>
  );
}
