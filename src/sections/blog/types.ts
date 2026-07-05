import type { Theme, SxProps } from "@mui/material/styles";
import type { Post, Comment, AuthorInfo, ReplyComment } from "src/types/domain";

// ----------------------------------------------------------------------

export interface PostCommentEditProps {
  value: string;
  saving: boolean;
  onChange: (value: string) => void;
  onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface PostCommentFormProps {
  postId?: string;
  onCommentAdded?: (result: { message: string }) => void;
  onCommentUpdated?: () => void;
  parentCommentId?: string;
}

export interface PostCommentItemProps {
  name: string;
  avatarUrl?: string;
  message: string;
  tagUser?: string;
  postedAt: string | Date;
  hasReply?: boolean;
  comment: Comment | ReplyComment;
  postId?: string;
  parentCommentId?: string;
  onCommentUpdated?: () => void;
}

export interface PostCommentListProps {
  comments?: Comment[];
  postId?: string;
  onCommentUpdated?: () => void;
}

export interface PostCommentMenuProps {
  open: boolean;
  anchorEl: Element | null;
  deleting: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface PostDetailsHeroProps {
  title?: string;
  author?: AuthorInfo;
  coverUrl?: string;
  createdAt?: string | Date;
  /**
   * Post id used to build the share URL. When absent (e.g. the draft preview)
   * the share actions are hidden so no `/post/undefined/` link is emitted.
   */
  postId?: string;
}

export interface PostDetailsPreviewProps {
  open: boolean;
  title?: string;
  content?: string;
  isValid: boolean;
  onClose: () => void;
  coverUrl?: string | File | null;
  onSubmit: () => void;
  description?: string;
  isSubmitting: boolean;
}

export interface PublishOption {
  value: string;
}

export interface PostDetailsToolbarProps {
  publish: string;
  backLink: string;
  editLink: string;
  liveLink: string;
  publishOptions: PublishOption[];
  onChangePublish: (value: string) => void;
  postId: string;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export type PostItemFeedProps = {
  post: Post;
  /**
   * Tags the feed is currently filtered by. When set, the card surfaces any
   * matching tag first so it's never hidden by the MAX_TAGS truncation — that
   * truncation is why a filtered post could look like it didn't match.
   */
  activeTags?: string[];
};

export interface PostItemHorizontalMenuProps {
  open: boolean;
  anchorEl: Element | null;
  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface InfoBlockProps {
  totalComments: number;
  totalViews: number;
  totalShares: number;
  readingTime?: number;
  sx?: SxProps<Theme>;
}

export interface PostListHorizontalProps {
  posts: Post[];
  loading?: boolean;
}

export interface PostListProps {
  posts: Post[];
  loading?: boolean;
  /** Active filter tags — forwarded to each card so the matched tag stays visible. */
  activeTags?: string[];
}

export interface PostNewEditActionsProps {
  isEdit: boolean;
  isSubmitting: boolean;
  onPreview: () => void;
}

export interface PostNewEditDetailsProps {
  onRemoveFile: () => void;
}

export interface PostNewEditFormProps {
  currentPost?: Post;
}

export type PostRelatedProps = {
  currentPostId?: string;
  tags: string[];
};

export interface PostSearchProps {
  query: string;
  results: Post[];
  onSearch: (inputValue: string) => void;
  hrefItem: (postId: string) => string;
  loading?: boolean;
  dashboard?: boolean;
}

export interface PostItemSkeletonProps {
  sx?: SxProps<Theme>;
  amount?: number;
  variant?: "vertical" | "horizontal";
  [key: string]: unknown;
}

export interface SortOption {
  value: string;
}

export interface PostSortProps {
  sort: string;
  sortOptions: SortOption[];
  onSort: (value: string) => void;
}
