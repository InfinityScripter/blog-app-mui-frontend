import type { ReactNode, FormEventHandler } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import { FormProvider as RHFForm } from "react-hook-form";

// ----------------------------------------------------------------------

interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  children: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  methods: UseFormReturn<TFieldValues>;
}

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
