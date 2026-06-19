import type { User } from "src/types/domain";

import { z as zod } from "zod";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";
import { STORAGE_KEY } from "src/auth/context/jwt";
import { zodResolver } from "@hookform/resolvers/zod";
// Import the two pieces this form needs directly — NOT from the hook-form
// barrel. The barrel's `Field` namespace statically pulls RHFEditor (tiptap),
// RHFUpload (dropzone) and RHFPhoneInput (libphonenumber), which would bloat
// the public /post/[id] bundle by ~900 KB.
import { Form } from "src/components/hook-form/form-provider";
import { addComment, getCurrentUser } from "src/actions/blog-ssr";
import { RHFTextField } from "src/components/hook-form/rhf-text-field";

// ----------------------------------------------------------------------

export const CommentSchema = zod.object({
  comment: zod.string().min(1, { message: "Необходимо ввести комментарий!" }),
});

// ----------------------------------------------------------------------

interface PostCommentFormProps {
  postId?: string;
  onCommentAdded?: (result: { message: string }) => void;
  onCommentUpdated?: () => void;
  parentCommentId?: string;
}

export function PostCommentForm({
  postId: propPostId,
  onCommentAdded,
  onCommentUpdated,
  parentCommentId,
}: PostCommentFormProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ id: string }>();

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
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (!accessToken) {
        return;
      }

      try {
        const response = await getCurrentUser();
        setCurrentUser(response.user);
        // eslint-disable-next-line no-shadow
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Authorization token missing"
        ) {
          return;
        }

        console.error("Failed to fetch user:", error);
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
      setError(
        error instanceof Error ? error.message : "Failed to add comment",
      );
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

        <RHFTextField
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
