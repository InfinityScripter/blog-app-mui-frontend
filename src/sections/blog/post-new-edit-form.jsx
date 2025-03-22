import { z as zod } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControlLabel from "@mui/material/FormControlLabel";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useBoolean } from "src/hooks/use-boolean";

import { _tags } from "src/_mock";

import { toast } from "src/components/snackbar";
import { Form, Field, schemaHelper } from "src/components/hook-form";

import axios from "../../utils/axios";
import { PostDetailsPreview } from "./post-details-preview";
import { createPost, updatePost } from "../../actions/blog-ssr";

// ----------------------------------------------------------------------

export const NewPostSchema = zod.object({
  title: zod.string().min(1, { message: "Заголовок обязателен!" }),
  description: zod.string().min(1, { message: "Описание обязательно!" }),
  content: schemaHelper
    .editor()
    .min(100, { message: "Содержание должно быть не менее 100 символов" }),
  coverUrl: schemaHelper.file({
    message: { required_error: "Обложка обязательна!" },
  }),
  tags: zod.string().array().min(2, { message: "Должно быть не менее 2 тегов!" }),
  metaKeywords: zod
    .string()
    .array()
    .nonempty({ message: "Мета-ключевые слова обязательны!" }),
  publish: zod.boolean(),
  // Not required
  metaTitle: zod.string(),
  metaDescription: zod.string(),
});

// ----------------------------------------------------------------------

export function PostNewEditForm({ currentPost }) {
  const router = useRouter();

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
      publish: currentPost ? currentPost.publish === "published" : false,
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

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const finalData = { ...data };

      finalData.publish = data.publish ? "published" : "draft";
      // Handle file upload if there's a new file
      if (data.coverUrl && data.coverUrl instanceof File) {
        const formData = new FormData();
        formData.append("file", data.coverUrl);

        const uploadResponse = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        finalData.coverUrl = uploadResponse.data.file.path;
      }

      let response;
      if (currentPost) {
        // Update an existing post
        response = await updatePost({ ...finalData, id: currentPost._id });
      } else {
        // Create a new post
        response = await createPost(finalData);
      }

      reset();
      preview.onFalse();
      toast.success(currentPost ? "Успешно обновлено!" : "Успешно создано!");
      router.push(paths.dashboard.post.root);
      console.info("Response:", response);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Операция не удалась");
    }
  });

  const handleRemoveFile = useCallback(() => {
    setValue("coverUrl", null);
  }, [setValue]);

  const renderDetails = (
    <Card>
      <CardHeader
        title="Детали"
        subheader="Заголовок, краткое описание, изображение..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="title" label="Заголовок поста" />

        <Field.Text name="description" label="Описание" multiline rows={3} />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Содержание</Typography>
          <Field.Editor name="content" sx={{ maxHeight: 480 }} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Обложка</Typography>
          <Field.Upload
            name="coverUrl"
            maxSize={3145728}
            onDelete={handleRemoveFile}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Свойства"
        subheader="Дополнительные функции и атрибуты..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Autocomplete
          name="tags"
          label="Теги"
          placeholder="+ Теги"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_tags.map((option) => option)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />

        <Field.Text name="metaTitle" label="Мета-заголовок" />

        <Field.Text
          name="metaDescription"
          label="Мета-описание"
          fullWidth
          multiline
          rows={3}
        />

        <Field.Autocomplete
          name="metaKeywords"
          label="Мета-ключевые слова"
          placeholder="+ Ключевые слова"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_tags.map((option) => option)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />

        <FormControlLabel
          control={
            <Switch defaultChecked inputProps={{ id: "comments-switch" }} />
          }
          label="Включить комментарии"
        />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Box
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      justifyContent="flex-end"
    >
      <Controller
        name="publish"
        control={methods.control}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel
            control={
              <Switch
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
              />
            }
            label="Опубликовать"
            sx={{ pl: 3, flexGrow: 1 }}
          />
        )}
      />

      <div>
        <Button
          color="inherit"
          variant="outlined"
          size="large"
          onClick={preview.onTrue}
        >
          Предпросмотр
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentPost ? "Создать пост" : "Сохранить изменения"}
        </LoadingButton>
      </div>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5} sx={{ mx: "auto", maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Stack>

      <PostDetailsPreview
        isValid={isValid}
        onSubmit={onSubmit}
        title={values.title}
        open={preview.value}
        content={values.content}
        onClose={preview.onFalse}
        coverUrl={values.coverUrl}
        isSubmitting={isSubmitting}
        description={values.description}
      />
    </Form>
  );
}
