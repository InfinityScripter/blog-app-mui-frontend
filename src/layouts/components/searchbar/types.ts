import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import type {
  NavItemBaseProps,
  NavSectionDataProps,
} from "src/components/nav-section/types";

// ----------------------------------------------------------------------

export interface SearchbarProps {
  data?: NavSectionDataProps[];
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface SearchButtonProps {
  onOpen: () => void;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

// ----------------------------------------------------------------------

/** A segment produced by `autosuggest-highlight/parse`. */
interface HighlightPart {
  text: string;
  highlight: boolean;
}

export interface ResultItemProps {
  title?: HighlightPart[];
  path?: HighlightPart[];
  groupLabel?: ReactNode;
  onClickItem?: () => void;
  [key: string]: unknown;
}

// ----------------------------------------------------------------------

export interface SearchResultItem {
  group: string;
  title: string;
  path: string;
}

/**
 * A nav item flattened with its parent subheader carried alongside. The index
 * signature keeps it compatible with `flattenArray`'s `Flattenable` constraint.
 */
export interface SearchLoopItem extends NavItemBaseProps {
  subheader?: string;
  children?: SearchLoopItem[];
  [key: string]: unknown;
}

export interface SearchNavSection {
  subheader?: string;
  items: NavItemBaseProps[];
}

// ----------------------------------------------------------------------

export interface RenderItemsProps {
  dataFiltered: SearchResultItem[];
  searchQuery: string;
  onClickItem: (path: string) => void;
}
