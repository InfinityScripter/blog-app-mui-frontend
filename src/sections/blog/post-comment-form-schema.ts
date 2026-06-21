import { z as zod } from "zod";

// ----------------------------------------------------------------------

export const CommentSchema = zod.object({
  comment: zod.string().min(1, { message: "Необходимо ввести комментарий!" }),
});
