import type {
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";

import type { Country } from "./utils";

// ----------------------------------------------------------------------

type CountryValueMode = "label" | "code";
export type CountryOption = Country["label"] | Country["code"];

export interface CountrySelectInputProps {
  params: AutocompleteRenderInputParams;
  label?: string;
  placeholder?: string;
  helperText?: string;
  hiddenLabel?: boolean;
  error?: boolean;
  multiple?: boolean;
}

export interface CountrySelectProps
  extends Omit<
    AutocompleteProps<
      CountryOption,
      boolean | undefined,
      boolean | undefined,
      boolean | undefined
    >,
    | "options"
    | "renderInput"
    | "renderOption"
    | "renderTags"
    | "getOptionLabel"
    | "multiple"
  > {
  id: string;
  label?: string;
  error?: boolean;
  multiple?: boolean;
  helperText?: string;
  hiddenLabel?: boolean;
  placeholder?: string;
  getValue?: CountryValueMode;
}
