import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export type FiltersResultProps = {
  totalResults: number;
  onReset: () => void;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export type FiltersBlockProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  isShow: boolean;
  sx?: SxProps<Theme>;
};
