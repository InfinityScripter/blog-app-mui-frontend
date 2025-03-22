import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";

import { addComment, getCurrentUser } from "src/actions/blog-ssr";

import { Form, Field } from "src/components/hook-form";

// ----------------------------------------------------------------------

export const CommentSchema = zod.object({
  comment: zod.string().min(1, { message: "Необходимо ввести комментарий!" }),
});

// ----------------------------------------------------------------------

export function PostCommentForm({
  postId: propPostId,
  onCommentAdded,
  onCommentUpdated,
  parentCommentId,
}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();

  // Get post ID from props or URL params
  const postId = propPostId || params?.id;

  const defaultValues = { comment: "" };

  const methods = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        // eslint-disable-next-line no-shadow
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setError("Пожалуйста, войдите чтобы оставить комментарий");
      }
    };
    fetchUser();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError(null);

      if (!currentUser) {
        setError("Пожалуйста, войдите чтобы оставить комментарий");
        return;
      }

      if (!postId) {
        setError("Невозможно добавить комментарий в данный момент");
        return;
      }

      const commentData = {
        message: data.comment,
        parentCommentId: parentCommentId || null,
      };

      const result = await addComment(postId, commentData);
      reset();

      if (onCommentAdded) {
        onCommentAdded(result);
      }

      if (onCommentUpdated) {
        onCommentUpdated();
      }
      // eslint-disable-next-line no-shadow
    } catch (error) {
      console.error("Failed to add comment:", error);
      setError(error.message || "Failed to add comment");
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
          placeholder="Оставьте комментарий..."
          multiline
          rows={4}
        />

        <Stack direction="row" alignItems="center">
          <Stack direction="row" alignItems="center" flexGrow={1}>
            {/* <IconButton> */}
            {/*  <Iconify icon="solar:gallery-add-bold" /> */}
            {/* </IconButton> */}

            {/* <IconButton> */}
            {/*  <Iconify icon="eva:attach-2-fill" /> */}
            {/* </IconButton> */}

            {/* <IconButton> */}
            {/*  <Iconify icon="eva:smiling-face-fill" /> */}
            {/* </IconButton> */}
          </Stack>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!currentUser}
          >
            {parentCommentId ? "Отправить ответ" : "Отправить комментарий"}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
