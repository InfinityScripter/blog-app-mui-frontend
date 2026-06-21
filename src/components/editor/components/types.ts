import type { Editor } from "@tiptap/react";
import type { Theme, SxProps } from "@mui/material/styles";
import type {
  ReactNode,
  ElementType,
  MouseEvent as ReactMouseEvent,
} from "react";

// ----------------------------------------------------------------------

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingBlockProps {
  editor: Editor;
}

export interface ImageBlockProps {
  editor: Editor;
}

export interface LinkBlockProps {
  editor: Editor;
}

export interface ToolbarBasicItemsProps {
  editor: Editor;
}

export interface ToolbarItemProps {
  sx?: SxProps<Theme>;
  icon?: ReactNode;
  label?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  component?: ElementType;
  className?: string;
  onClick?: (event: ReactMouseEvent) => void;
}
