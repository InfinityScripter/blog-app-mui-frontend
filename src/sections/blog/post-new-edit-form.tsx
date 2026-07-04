import type { Post } from "src/types/domain";

import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { useForm } from "react-hook-form";
import { useRouter } from "src/routes/hooks";
import { toast } from "src/components/snackbar";
import { Form } from "src/components/hook-form";
import { useAuthContext } from "src/auth/hooks";
import { PUBLISH_STATUS } from "src/types/domain";
import { useBoolean } from "src/hooks/use-boolean";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect, useCallback } from "react";

import axios, { endpoints } from "../../utils/axios";
import { NewPostSchema } from "./post-new-edit-schema";
import { PostDetailsPreview } from "./post-details-preview";
import { PostNewEditDetails } from "./post-new-edit-details";
import { PostNewEditActions } from "./post-new-edit-actions";
import { createPost, updatePost } from "../../actions/blog-ssr";
import { PostNewEditProperties } from "./post-new-edit-properties";
import { revalidatePublicPosts } from "../../actions/revalidate-posts";

import type { PostNewEditFormProps } from "./types";

// ----------------------------------------------------------------------

export function PostNewEditForm({ currentPost }: PostNewEditFormProps) {
  const router = useRouter();
  const { user } = useAuthContext();

  const preview = useBoolean();

  const defaultValues = useMemo(
    () => ({
      title: currentPost?.title || "",
      description: currentPost?.description || "",
      content: currentPost?.content || "",
      coverUrl: currentPost?.coverUrl || null,
      tags: currentPost?.tags || [],
      metaKeywords: currentPost?.metaKeywords || [],
      metaTitle: currentPost?.metaTitle || "",
      metaDescription: currentPost?.metaDescription || "",
      publish: currentPost
        ? currentPost.publish === PUBLISH_STATUS.published
        : false,
    }),
    [currentPost],
  );

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  // `values.coverUrl` is typed `unknown` (zod `custom().transform`); narrow it
  // to the preview prop shape with runtime guards instead of casting.
  const previewCoverUrl: string | File | null =
    typeof values.coverUrl === "string" || values.coverUrl instanceof File
      ? values.coverUrl
      : null;

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const finalData: Partial<Post> = {
        ...data,
        publish: data.publish ? PUBLISH_STATUS.published : PUBLISH_STATUS.draft,
        coverUrl: typeof data.coverUrl === "string" ? data.coverUrl : undefined,
      };

      // Handle file upload if there's a new file
      if (data.coverUrl && data.coverUrl instanceof File) {
        const formData = new FormData();
        formData.append("file", data.coverUrl);

        const uploadResponse = await axios.post(endpoints.upload, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        finalData.coverUrl = uploadResponse.data.file.path;
      }

      let response;
      if (currentPost) {
        // Update an existing post
        response = await updatePost({
          ...finalData,
          id: String(currentPost._id),
        });
      } else {
        // Create a new post
        response = await createPost(finalData);
      }

      // Drop the public ISR cache so the new/edited post appears immediately
      // instead of after the 1h revalidate window. Fire-and-forget — a failed
      // revalidation must not block the success toast or navigation (the cache
      // still self-refreshes within the hour, and the admin has a manual button).
      revalidatePublicPosts(user?.accessToken).catch(() => {});

      reset();
      preview.onFalse();
      toast.success(currentPost ? "Успешно обновлено!" : "Успешно создано!");
      router.push(paths.dashboard.post.root);
      console.info("Response:", response);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Операция не удалась",
      );
    }
  });

  const handleRemoveFile = useCallback(() => {
    setValue("coverUrl", null);
  }, [setValue]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5} sx={{ mx: "auto", maxWidth: { xs: 720, xl: 880 } }}>
        <PostNewEditDetails onRemoveFile={handleRemoveFile} />

        <PostNewEditProperties />

        <PostNewEditActions
          isEdit={Boolean(currentPost)}
          isSubmitting={isSubmitting}
          onPreview={preview.onTrue}
        />
      </Stack>

      <PostDetailsPreview
        isValid={isValid}
        onSubmit={onSubmit}
        title={values.title}
        open={preview.value}
        content={values.content}
        onClose={preview.onFalse}
        coverUrl={previewCoverUrl}
        isSubmitting={isSubmitting}
        description={values.description}
      />
    </Form>
  );
}
