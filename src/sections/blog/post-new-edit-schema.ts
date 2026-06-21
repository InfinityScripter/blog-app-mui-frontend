import { z as zod } from "zod";
import { schemaHelper } from "src/components/hook-form";

// ----------------------------------------------------------------------

export const NewPostSchema = zod.object({
  title: zod.string().min(1, { message: "Заголовок обязателен!" }),
  description: zod.string().min(1, { message: "Описание обязательно!" }),
  content: schemaHelper
    .editor({})
    .min(100, { message: "Содержание должно быть не менее 100 символов" }),
  coverUrl: schemaHelper.file({
    message: { required_error: "Обложка обязательна!" },
  }),
  tags: zod
    .string()
    .array()
    .min(2, { message: "Должно быть не менее 2 тегов!" }),
  metaKeywords: zod
    .string()
    .array()
    .nonempty({ message: "Мета-ключевые слова обязательны!" }),
  publish: zod.boolean(),
  // Not required
  metaTitle: zod.string(),
  metaDescription: zod.string(),
});
