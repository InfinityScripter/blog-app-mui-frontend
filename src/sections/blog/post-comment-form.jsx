import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { addComment, getCurrentUser } from 'src/actions/blog-ssr';

// ----------------------------------------------------------------------

export const CommentSchema = zod.object({
  comment: zod.string().min(1, { message: 'Comment is required!' }),
});

// ----------------------------------------------------------------------

export function PostCommentForm({ postId: propPostId, onCommentAdded }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();

  // Get post ID from props or URL params
  const postId = propPostId || params?.id;

  const defaultValues = { comment: '' };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError('Please login to comment');
      }
    };
    fetchUser();
  }, []);

  const methods = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError(null);

      if (!currentUser) {
        setError('Please login to comment');
        return;
      }

      if (!postId) {
        setError('Unable to add comment at this time');
        return;
      }

      const commentData = {
        message: data.comment,
      };

      const result = await addComment(postId, commentData);
      reset();

      if (onCommentAdded) {
        onCommentAdded(result);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      setError(error.message || 'Failed to add comment');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Field.Text
          name="comment"
          placeholder="Write some of your comments..."
          multiline
          rows={4}
        />

        <Stack direction="row" alignItems="center">
          <Stack direction="row" alignItems="center" flexGrow={1}>
            {/*<IconButton>*/}
            {/*  <Iconify icon="solar:gallery-add-bold" />*/}
            {/*</IconButton>*/}

            {/*<IconButton>*/}
            {/*  <Iconify icon="eva:attach-2-fill" />*/}
            {/*</IconButton>*/}

            {/*<IconButton>*/}
            {/*  <Iconify icon="eva:smiling-face-fill" />*/}
            {/*</IconButton>*/}
          </Stack>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!currentUser}
          >
            Post comment
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}

