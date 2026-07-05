"use client";

import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useAuthContext } from "src/auth/hooks";
import { addComment } from "src/actions/blog-ssr";
import LoadingButton from "@mui/lab/LoadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
// Import the two pieces this form needs directly — NOT from the hook-form
// barrel. The barrel's `Field` namespace statically pulls RHFEditor (tiptap),
// RHFUpload (dropzone) and RHFPhoneInput (libphonenumber), which would bloat
// the public /post/[id] bundle by ~900 KB.
import { Form } from "src/components/hook-form/form-provider";
import { RHFTextField } from "src/components/hook-form/rhf-text-field";

import { getCommentSchema } from "./post-comment-form-schema";

import type { PostCommentFormProps } from "./types";

// ----------------------------------------------------------------------

export function PostCommentForm({
  postId: propPostId,
  onCommentAdded,
  onCommentUpdated,
  parentCommentId,
}: PostCommentFormProps) {
  // Login state comes from the cookie-based auth context (the AuthProvider
  // already resolved the session via /me). No client-readable token to inspect.
  const { user: currentUser } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ id: string }>();
  const t = useTranslations("blog");

  // Get post ID from props or URL params
  const postId = propPostId || params?.id;

  const defaultValues = { comment: "" };

  const schema = useMemo(() => getCommentSchema(t), [t]);

  const methods = useForm({
    resolver: zodResolver(schema),
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
        setError(t("comments.loginRequired"));
        return;
      }

      if (!postId) {
        setError(t("comments.postMissing"));
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
          placeholder={t("comments.formPlaceholder")}
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
            {parentCommentId ? t("comments.submitReply") : t("comments.submit")}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
