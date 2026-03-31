import type { ReactNode } from 'react';

export type PublishStatus = 'draft' | 'published';

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

export interface FavoritePerson {
  name: string;
  avatarUrl?: string;
}

export interface AuthorInfo {
  name: string;
  avatarUrl?: string;
}

export interface Post {
  id?: string;
  publish: PublishStatus;
  title: string;
  description?: string;
  content?: string;
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
  name: string;
  email: string;
  avatarURL?: string;
  isEmailVerified?: boolean;
  role?: 'user' | 'admin';
}

export interface FileMeta {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  uploadDate: string | Date;
  userId: string;
}

// Navigation types
export interface NavItem {
  title: string;
  path: string;
  icon?: ReactNode;
  children?: NavItem[];
  info?: ReactNode;
  disabled?: boolean;
  roles?: string[];
  caption?: string;
}

export interface NavSection {
  subheader: string;
  items: NavItem[];
}

// Theme types
export type ColorScheme = 'light' | 'dark';
export type ThemeDirection = 'ltr' | 'rtl';
export type FontFamily = string;
export type NavLayout = 'vertical' | 'horizontal' | 'mini';
export type NavColor = 'integrate' | 'apparent';
export type Contrast = 'default' | 'bold';
export type PrimaryColor = 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red';

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

// Form types
export interface FormFieldError {
  message?: string;
  type?: string;
}

export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Record<string, FormFieldError>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
} 