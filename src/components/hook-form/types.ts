import type { BoxProps } from "@mui/material/Box";
import type { ChipProps } from "@mui/material/Chip";
import type { RadioProps } from "@mui/material/Radio";
import type { SwitchProps } from "@mui/material/Switch";
import type { SelectProps } from "@mui/material/Select";
import type { Theme, SxProps } from "@mui/material/styles";
import type { CheckboxProps } from "@mui/material/Checkbox";
import type { TextFieldProps } from "@mui/material/TextField";
import type { FormLabelProps } from "@mui/material/FormLabel";
import type { InputLabelProps } from "@mui/material/InputLabel";
import type { FormControlProps } from "@mui/material/FormControl";
import type { FormHelperTextProps } from "@mui/material/FormHelperText";
import type { FormControlLabelProps } from "@mui/material/FormControlLabel";
import type { ReactNode, SyntheticEvent, FormEventHandler } from "react";
import type { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

// ----------------------------------------------------------------------

/** Generic `{ label, value }` option used by select/radio/checkbox fields. */
export interface FieldOption {
  label: string;
  value: string;
}

/** Shared form-helper slot props. */
interface WrapSlotProps {
  wrap?: SxProps<Theme>;
  formLabel?: FormLabelProps;
  formHelperText?: FormHelperTextProps;
}

// ----------------------------------------------------------------------

export type RHFCheckboxProps = Omit<FormControlLabelProps, "control"> & {
  name: string;
  helperText?: ReactNode;
  slotProps?: WrapSlotProps & {
    checkbox?: CheckboxProps;
  };
};

export interface RHFMultiCheckboxProps {
  name: string;
  label?: ReactNode;
  helperText?: ReactNode;
  options: FieldOption[];
  slotProps?: WrapSlotProps & {
    checkbox?: CheckboxProps;
  };
}

export type RHFSwitchProps = Omit<FormControlLabelProps, "control"> & {
  name: string;
  helperText?: ReactNode;
  slotProps?: WrapSlotProps & {
    switch?: SwitchProps;
  };
};

export interface RHFMultiSwitchProps {
  name: string;
  label?: ReactNode;
  helperText?: ReactNode;
  options: FieldOption[];
  slotProps?: WrapSlotProps & {
    switch?: SwitchProps;
  };
}

export interface RHFRadioGroupProps {
  name: string;
  label?: ReactNode;
  helperText?: ReactNode;
  options: FieldOption[];
  slotProps?: WrapSlotProps & {
    radio?: RadioProps;
  };
}

export type RHFSelectProps = Omit<TextFieldProps, "name"> & {
  name: string;
  native?: boolean;
  children?: ReactNode;
  helperText?: ReactNode;
  inputProps?: Record<string, unknown>;
  InputLabelProps?: Record<string, unknown>;
  slotProps?: {
    paper?: SxProps<Theme>;
  };
};

export type RHFMultiSelectProps = Omit<FormControlProps, "children"> & {
  name: string;
  chip?: boolean;
  checkbox?: boolean;
  label?: ReactNode;
  placeholder?: string;
  helperText?: ReactNode;
  options: FieldOption[];
  slotProps?: {
    chip?: ChipProps;
    select?: SelectProps<FieldOption["value"][]>;
    checkbox?: CheckboxProps;
    inputLabel?: InputLabelProps;
    formHelperText?: FormHelperTextProps;
  };
};

export interface RHFCodeProps {
  name: string;
  [key: string]: unknown;
}

export interface RHFRatingProps {
  name: string;
  helperText?: ReactNode;
  slotProps?: {
    wrap?: SxProps<Theme>;
    formHelperText?: FormHelperTextProps;
  };
  [key: string]: unknown;
}

export interface RHFSliderProps {
  name: string;
  helperText?: ReactNode;
  [key: string]: unknown;
}

export interface RHFEditorProps {
  name: string;
  helperText?: string;
  [key: string]: unknown;
}

export interface RHFPhoneInputProps {
  name: string;
  helperText?: ReactNode;
  [key: string]: unknown;
}

export interface RHFCountrySelectProps {
  name: string;
  helperText?: string;
  [key: string]: unknown;
}

export interface RHFAutocompleteProps {
  name: string;
  label?: ReactNode;
  helperText?: ReactNode;
  hiddenLabel?: boolean;
  placeholder?: string;
  [key: string]: unknown;
}

export interface RHFDatePickerProps {
  name: string;
  slotProps?: {
    textField?: {
      helperText?: ReactNode;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface RHFUploadProps {
  name: string;
  multiple?: boolean;
  helperText?: ReactNode;
  [key: string]: unknown;
}

export interface RHFUploadAvatarProps {
  name: string;
  [key: string]: unknown;
}

export interface RHFUploadBoxProps {
  name: string;
  [key: string]: unknown;
}

export interface RHFBoxWrapProps extends BoxProps {
  name: string;
}

export interface RHFTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<TextFieldProps, "name"> {
  name: FieldPath<TFieldValues>;
  helperText?: string;
  type?: string;
}

export interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  children: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  methods: UseFormReturn<TFieldValues>;
}

// View MUI `Autocomplete` through the subset of props used here, leaving
// `options` (supplied via `...other`) optional so the wrapper type-checks.
export interface AutocompleteViewProps {
  id?: string;
  value?: unknown;
  onChange?: (event: SyntheticEvent, newValue: unknown) => void;
  renderInput: (params: AutocompleteRenderInputParams) => ReactNode;
  options?: readonly unknown[];
  [key: string]: unknown;
}
