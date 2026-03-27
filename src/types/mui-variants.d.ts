import "@mui/material/Button";
import "@mui/material/ButtonGroup";
import "@mui/material/Chip";
import "@mui/material/Fab";
import "@mui/material/Pagination";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/ButtonGroup" {
  interface ButtonGroupPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/Fab" {
  interface FabPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/Pagination" {
  interface PaginationPropsVariantOverrides {
    soft: true;
  }
}
