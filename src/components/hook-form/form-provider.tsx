import type { FieldValues } from "react-hook-form";

import { FormProvider as RHFForm } from "react-hook-form";

import type { FormProps } from "./types";

// ----------------------------------------------------------------------

export function Form<TFieldValues extends FieldValues = FieldValues>({
  children,
  onSubmit,
  methods,
}: FormProps<TFieldValues>) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {children}
      </form>
    </RHFForm>
  );
}
