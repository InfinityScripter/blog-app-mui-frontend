import { z as zod } from "zod";

// ----------------------------------------------------------------------

// Factory so the validation message can be localized: the form builds the
// schema with its `blog` translator (see `useMemo` in post-comment-form). A
// module-scope schema can't call `t()`.
export function getCommentSchema(t: (key: string) => string) {
  return zod.object({
    comment: zod.string().min(1, { message: t("comments.required") }),
  });
}
