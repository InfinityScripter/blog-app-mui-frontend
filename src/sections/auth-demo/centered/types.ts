// ----------------------------------------------------------------------

export type CenteredResetPasswordFormProps = {
  error: string;
  success: string;
  isSubmitting: boolean;
};

export type CenteredSignInFormProps = {
  isSubmitting: boolean;
};

export type CenteredSignUpFormProps = {
  isSubmitting: boolean;
};

export type CenteredUpdatePasswordFormProps = {
  error: string;
  success: string;
  codeFromUrl: string;
  isSubmitting: boolean;
};

export type CenteredVerifyFormProps = {
  isSubmitting: boolean;
};
