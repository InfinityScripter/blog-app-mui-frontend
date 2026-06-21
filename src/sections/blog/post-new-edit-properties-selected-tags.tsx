import type { ReactNode } from "react";
import type { AutocompleteRenderGetTagProps } from "@mui/material/Autocomplete";

import Chip from "@mui/material/Chip";

// ----------------------------------------------------------------------

export const renderSelectedTags = (
  selected: string[],
  getTagProps: AutocompleteRenderGetTagProps,
): ReactNode =>
  selected.map((option, index) => (
    <Chip
      {...getTagProps({ index })}
      key={option}
      label={option}
      size="small"
      color="info"
      variant="soft"
    />
  ));
