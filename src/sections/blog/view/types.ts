import type { Post } from "src/types/domain";

// ----------------------------------------------------------------------

export interface PostDetailsHomeViewProps {
  post?: Post;
  latestPosts?: Post[];
}

export interface PostDetailsViewProps {
  initialPost?: Post;
}

export interface PostEditViewProps {
  post?: Post;
}

export interface PostListHomeViewProps {
  posts: Post[];
}

export interface TagListViewProps {
  tag: string;
  posts: Post[];
}

// `orderBy` is constrained to `Record<string, unknown>`; the `Post` interface
// has no index signature, so widen each element with an intersection type
// (via spread, no cast) to satisfy the sort call's generic constraint.
export type SortablePost = Post & Record<string, unknown>;
