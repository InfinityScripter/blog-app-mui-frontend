import { z as zod } from "zod";
import { schemaHelper } from "src/components/hook-form";

// ----------------------------------------------------------------------

// Factory so the validation messages can be localized: the form builds the
// schema with its `blog` translator (see `useMemo` in post-new-edit-form). A
// module-scope schema can't call `t()`.
export function getNewPostSchema(t: (key: string) => string) {
  return zod.object({
    title: zod.string().min(1, { message: t("validation.titleRequired") }),
    description: zod
      .string()
      .min(1, { message: t("validation.descriptionRequired") }),
    content: schemaHelper
      .editor({})
      .min(100, { message: t("validation.contentMin") }),
    coverUrl: schemaHelper.file({
      message: { required_error: t("validation.coverRequired") },
    }),
    tags: zod
      .string()
      .array()
      .min(2, { message: t("validation.tagsMin") }),
    metaKeywords: zod
      .string()
      .array()
      .nonempty({ message: t("validation.metaKeywordsRequired") }),
    publish: zod.boolean(),
    // Not required
    metaTitle: zod.string(),
    metaDescription: zod.string(),
  });
}
