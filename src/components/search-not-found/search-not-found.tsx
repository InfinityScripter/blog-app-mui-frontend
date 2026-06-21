import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { SearchNotFoundProps } from "./types";

// ----------------------------------------------------------------------

export type { SearchNotFoundProps } from "./types";

export const SearchNotFound = forwardRef<HTMLDivElement, SearchNotFoundProps>(
  ({ query, sx, ...other }, ref) => {
    if (!query) {
      return (
        <Typography variant="body2" sx={sx}>
          Please enter keywords
        </Typography>
      );
    }

    return (
      <Box
        ref={ref}
        sx={{ textAlign: "center", borderRadius: 1.5, ...sx }}
        {...other}
      >
        <Box sx={{ mb: 1, typography: "h6" }}>Not found</Box>

        <Typography variant="body2">
          No results found for &nbsp;
          <strong>{`"${query}"`}</strong>
          .
          <br /> Try checking for typos or using complete words.
        </Typography>
      </Box>
    );
  },
);
