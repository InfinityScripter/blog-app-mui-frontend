import type { Ref } from "react";
import type { TextFieldProps } from "@mui/material/TextField";

import { forwardRef } from "react";
import TextField from "@mui/material/TextField";

// ----------------------------------------------------------------------

export const CustomInput = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ ...props }, ref: Ref<HTMLInputElement>) => (
    <TextField inputRef={ref} {...props} />
  ),
);
