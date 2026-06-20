"use client";

import type { User } from "src/types/domain";
import type { GenericMessageResponse } from "src/types/api";

import axiosInstance, { endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------

interface UserResponse extends GenericMessageResponse {
  success: boolean;
  user: User;
}

interface MessageSuccessResponse extends GenericMessageResponse {
  success: boolean;
}

interface UploadFileResponse {
  file: {
    path: string;
  };
}

// ----------------------------------------------------------------------

/**
 * Upload an image file via the existing generic upload endpoint and return the
 * resulting URL/path. Mirrors the flow in `post-new-edit-form` (POST
 * `multipart/form-data` to `/api/upload`, read `data.file.path`).
 */
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post<UploadFileResponse>(
    endpoints.upload,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return res.data.file.path;
}

// ----------------------------------------------------------------------

/** PATCH /api/user/profile — update the current user's display name. */
export async function updateProfile(name: string): Promise<UserResponse> {
  const res = await axiosInstance.patch<UserResponse>(endpoints.user.profile, {
    name,
  });

  return res.data;
}

// ----------------------------------------------------------------------

/** POST /api/user/avatar — set the current user's avatar to an uploaded URL. */
export async function updateAvatar(avatarURL: string): Promise<UserResponse> {
  const res = await axiosInstance.post<UserResponse>(endpoints.user.avatar, {
    avatarURL,
  });

  return res.data;
}

// ----------------------------------------------------------------------

/** DELETE /api/user/avatar — clear the current user's avatar. */
export async function removeAvatar(): Promise<UserResponse> {
  const res = await axiosInstance.delete<UserResponse>(endpoints.user.avatar);

  return res.data;
}

// ----------------------------------------------------------------------

interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

/** POST /api/user/change-password — change the current user's password. */
export async function changePassword({
  currentPassword,
  newPassword,
}: ChangePasswordParams): Promise<MessageSuccessResponse> {
  const res = await axiosInstance.post<MessageSuccessResponse>(
    endpoints.user.changePassword,
    { currentPassword, newPassword },
  );

  return res.data;
}
