import type { Post } from "src/types/domain";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface PostSearchButtonProps {
  onOpen: () => void;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface PostResultItemProps {
  post: Post;
  query: string;
  onClickItem: () => void;
}

export interface PostResultListProps {
  results: Post[];
  query: string;
  onClickItem: (postId: string) => void;
}

export interface PostSearchEmptyProps {
  onClickItem: (postId: string) => void;
}
