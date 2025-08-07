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