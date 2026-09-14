import type { ReactNode } from "react";
import type { AutocompleteRenderValueGetItemProps } from "@mui/material/Autocomplete";

import Chip from "@mui/material/Chip";

// ----------------------------------------------------------------------

export const renderSelectedTags = (
  selected: string | readonly string[],
  getItemProps: AutocompleteRenderValueGetItemProps<true>,
): ReactNode => {
  const values = Array.isArray(selected) ? selected : [selected];

  return values.map((option, index) => (
    <Chip
      {...getItemProps({ index })}
      key={option}
      label={option}
      size="small"
      color="info"
      variant="soft"
    />
  ));
};
