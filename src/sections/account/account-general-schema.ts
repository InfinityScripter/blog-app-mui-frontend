import { z as zod } from "zod";
import { schemaHelper } from "src/components/hook-form";

// ----------------------------------------------------------------------

export const AccountGeneralSchema = zod.object({
  name: zod.string().min(1, { message: "Имя обязательно!" }),
  avatarURL: schemaHelper.file().nullable(),
  email: zod.string(),
  role: zod.string(),
});
