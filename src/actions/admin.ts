"use client";

import type { User } from "src/types/domain";

import useSWR from "swr";
import { useMemo } from "react";
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";

// Bot control хуки/экшены живут в ./bot — реэкспортим, чтобы импортёры
// (admin-bot-view и др.) не зависели от внутренней раскладки.
export * from "./bot";

interface AdminUser extends User {
  createdAt?: string | Date;
}

interface AdminUsersResponse {
  users: AdminUser[];
}

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetAdminUsers() {
  const { data, isLoading, error, mutate } = useSWR<AdminUsersResponse>(
    endpoints.admin.users,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      users: data?.users ?? [],
      usersLoading: isLoading,
      usersError: error,
      usersMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}

export async function deleteUser(id: string) {
  await axiosInstance.delete(endpoints.admin.userById(id));
}

// ----------------------------------------------------------------------

export interface AuditLog {
  id: string;
  action: string;
  actorId: string | null;
  actorRole: string | null;
  targetType: string | null;
  targetId: string | null;
  metadata: Record<string, unknown>;
  ip: string | null;
  requestId: string | null;
  createdAt: string;
}

export interface AuditLogsParams {
  action?: string;
  actorId?: string;
  targetType?: string;
  limit?: number;
  offset?: number;
}

interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  limit: number;
  offset: number;
}

export function useGetAuditLogs(params: AuditLogsParams, accessToken?: string) {
  // Передаём токен в ключ SWR явно (зеркало admin-posts-view): на свежем
  // логине запрос иначе уходит до setSession → бэкенд отдаёт 401/403. Ключ
  // null до появления токена → нет гонки.
  const key = accessToken
    ? [
        endpoints.admin.auditLogs,
        { headers: { Authorization: `Bearer ${accessToken}` }, params },
      ]
    : null;
  const { data, isLoading, error, mutate } = useSWR<AuditLogsResponse>(
    key,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      auditLogs: data?.logs ?? [],
      auditLogsTotal: data?.total ?? 0,
      auditLogsLoading: isLoading,
      auditLogsError: error,
      auditLogsMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}
