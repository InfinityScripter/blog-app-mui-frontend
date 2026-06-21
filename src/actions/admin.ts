"use client";

import type { User } from "src/types/domain";
import type {
  BotModel,
  BotStatus,
  BotProvider,
  ControlProviderName,
} from "src/sections/admin/bot-types";

import useSWR from "swr";
import { useMemo } from "react";
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";

export interface AdminUser extends User {
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

// ----------------------------------------------------------------------
// Bot control

interface BotStatusResponse {
  data: BotStatus;
}
interface BotProvidersResponse {
  data: { providers: BotProvider[] };
}
interface BotModelsResponse {
  data: { provider: string; models: BotModel[] };
}

// Статус опрашивается с refetch-при-фокусе: Telegram /model мог сменить модель
// в обход панели — на возврате во вкладку показываем актуальное состояние.
const botStatusOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: false,
};

export function useGetBotStatus(accessToken?: string) {
  const key = accessToken
    ? [
        endpoints.admin.bot.status,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      ]
    : null;
  const { data, isLoading, error, mutate } = useSWR<BotStatusResponse>(
    key,
    fetcher,
    botStatusOptions,
  );
  return useMemo(
    () => ({
      botStatus: data?.data ?? null,
      botStatusLoading: isLoading,
      botStatusError: error,
      botStatusMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}

export function useGetBotProviders(accessToken?: string) {
  const key = accessToken
    ? [
        endpoints.admin.bot.providers,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      ]
    : null;
  const { data, isLoading, error } = useSWR<BotProvidersResponse>(
    key,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      botProviders: data?.data.providers ?? [],
      botProvidersLoading: isLoading,
      botProvidersError: error,
    }),
    [data, isLoading, error],
  );
}

export function useGetBotModels(
  provider: ControlProviderName | null,
  accessToken?: string,
) {
  const key =
    accessToken && provider
      ? [
          endpoints.admin.bot.models(provider),
          { headers: { Authorization: `Bearer ${accessToken}` } },
        ]
      : null;
  const { data, isLoading, error } = useSWR<BotModelsResponse>(
    key,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      botModels: data?.data.models ?? [],
      botModelsLoading: isLoading,
      botModelsError: error,
    }),
    [data, isLoading, error],
  );
}

export async function setBotModel(
  provider: ControlProviderName,
  model: string,
) {
  await axiosInstance.post(endpoints.admin.bot.model, { provider, model });
}

export async function setBotMock(enabled: boolean) {
  await axiosInstance.post(endpoints.admin.bot.mock, { enabled });
}
