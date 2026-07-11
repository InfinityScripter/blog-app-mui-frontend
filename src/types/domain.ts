/**
 * Allowed values for a post's `publish` field. Use `PUBLISH_STATUS.published` /
 * `PUBLISH_STATUS.draft` instead of bare string literals so the union stays the
 * single source of truth (no hardcoded "published"/"draft" scattered around).
 */
export const PUBLISH_STATUS = {
  draft: "draft",
  published: "published",
} as const;

export type PublishStatus =
  (typeof PUBLISH_STATUS)[keyof typeof PUBLISH_STATUS];

export interface ReplyComment {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  message: string;
  tagUser?: string;
  postedAt: string | Date;
}

export interface Comment {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  message: string;
  postedAt: string | Date;
  replyComment: ReplyComment[];
}

interface FavoritePerson {
  name: string;
  avatarUrl?: string;
}

export interface AuthorInfo {
  name: string;
  avatarUrl?: string;
}

export interface Post {
  id?: string;
  /**
   * Mongo-era alias for `id`. The backend `toPublicPost` mapper still emits
   * `_id` alongside `id` (see blog-app-mui-backend `src/models/Post.ts`), and
   * the blog UI reads `post._id` for routing/keys. Kept optional so callers
   * that only have `id` still type-check.
   */
  _id?: string;
  publish: PublishStatus;
  title: string;
  description?: string;
  /**
   * Full HTML body. Present on detail responses; OMITTED from list responses
   * (the backend strips it for a lean feed payload — C7). Cards use `readingTime`
   * instead of deriving it from this.
   */
  content?: string;
  /** Server-computed reading time in minutes; present on list rows (see `content`). */
  readingTime?: number;
  coverUrl?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  totalViews: number;
  totalShares: number;
  totalComments: number;
  totalFavorites: number;
  favoritePerson: FavoritePerson[];
  comments: Comment[];
  userId: string;
  author: AuthorInfo;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface User {
  id: string;
  /**
   * Mongo-era alias for `id`. The backend `toPublicUser` mapper emits both
   * `_id` and `id` (see blog-app-mui-backend `src/utils/public-user.ts`); the
   * blog comment ownership check compares `user._id` to `comment.userId`.
   */
  _id?: string;
  name: string;
  email: string;
  avatarURL?: string;
  isEmailVerified?: boolean;
  role?: "user" | "admin";
}

// Theme types
export type ColorScheme = "light" | "dark";
export type ThemeDirection = "ltr" | "rtl";
type FontFamily = string;
type NavLayout = "vertical" | "horizontal" | "mini";
type NavColor = "integrate" | "apparent";
type Contrast = "default" | "bold";
type PrimaryColor = "default" | "cyan" | "purple" | "blue" | "orange" | "red";

export interface SettingsState {
  colorScheme: ColorScheme;
  direction: ThemeDirection;
  contrast: Contrast;
  navLayout: NavLayout;
  primaryColor: PrimaryColor;
  navColor: NavColor;
  compactLayout: boolean;
  fontFamily: FontFamily;
}
