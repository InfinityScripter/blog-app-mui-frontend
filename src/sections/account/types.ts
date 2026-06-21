import type { z as zod } from "zod";
import type { useBoolean } from "src/hooks/use-boolean";

import type { ChangePasswordSchema } from "./account-change-password-schema";

// ----------------------------------------------------------------------

export type AccountTabValue = "general" | "security";

export type ChangePasswordSchemaType = zod.infer<typeof ChangePasswordSchema>;

export type PasswordFieldProps = {
  name: keyof ChangePasswordSchemaType;
  label: string;
  visible: ReturnType<typeof useBoolean>;
};

export type AccountGeneralDetailsProps = {
  isChanged: boolean;
  isSubmitting: boolean;
};

export type AccountGeneralIdentityProps = {
  name?: string;
  role: string;
  verified: boolean;
  hasAvatar: boolean;
  removingAvatar: boolean;
  onRemoveAvatar: () => void;
};

export type RequirementProps = {
  ok: boolean;
  children: string;
};
