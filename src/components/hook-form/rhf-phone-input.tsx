import type { ReactNode, ComponentType } from "react";

import { Controller, useFormContext } from "react-hook-form";

import { PhoneInput as PhoneInputBase } from "../phone-input";

import type { RHFPhoneInputProps } from "./types";

// ----------------------------------------------------------------------

// `PhoneInput` is an untyped first-party `forwardRef` component (its source in
// `../phone-input/phone-input.tsx` has no prop types). View it through a precise
// prop type so this wrapper type-checks. The cast can only be removed by typing
// the source component, which lives outside this file's edit scope.
interface PhoneInputViewProps {
  fullWidth?: boolean;
  value?: string;
  onChange?: (newValue: string) => void;
  error?: boolean;
  helperText?: ReactNode;
  [key: string]: unknown;
}

const PhoneInput = PhoneInputBase as ComponentType<PhoneInputViewProps>;

export function RHFPhoneInput({
  name,
  helperText,
  ...other
}: RHFPhoneInputProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PhoneInput
          {...field}
          fullWidth
          value={field.value}
          onChange={(newValue) =>
            setValue(name, newValue, { shouldValidate: true })
          }
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
