"use client";

import useSWR from "swr";
import { useMemo } from "react";
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------
// Контракт админ-ручек управления ботом (/api/admin/bot/*).

export type ControlProviderName = "glm" | "deepseek" | "openrouter";

export type BotModel = {
  id: string;
  tier: "free" | "paid";
  note?: string;
};

type BotProvider = {
  name: ControlProviderName;
  label: string;
  hasKey: boolean;
};

export type BotStatus = {
  isAlive: boolean;
  provider?: string;
  model?: string;
  isMockEnabled?: boolean;
};

export type BotModelProbe = {
  provider: string;
  label: string;
  model: string;
  ok: boolean;
  ms: number;
  error?: string;
};

type BotModelsHealth = {
  healthy: boolean;
  checks: BotModelProbe[];
};

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

interface BotStatusResponse {
  data: BotStatus;
}
interface BotProvidersResponse {
  data: { providers: BotProvider[] };
}
interface BotModelsResponse {
  data: { provider: string; models: BotModel[] };
}
interface BotModelsHealthResponse {
  data: BotModelsHealth;
}

// Статус опрашивается с refetch-при-фокусе: Telegram /model мог сменить модель
// в обход панели — на возврате во вкладку показываем актуальное состояние.
const botStatusOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: false,
};

export function useGetBotStatus(enabled = true) {
  // Cookie auth (axios withCredentials) — gate on `enabled` (authenticated).
  const key = enabled ? endpoints.admin.bot.status : null;
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

export function useGetBotProviders(enabled = true) {
  const key = enabled ? endpoints.admin.bot.providers : null;
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
  enabled = true,
) {
  const key = enabled && provider ? endpoints.admin.bot.models(provider) : null;
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

export function useGetBotModelsHealth(enabled = true) {
  const key = enabled ? endpoints.admin.bot.modelsHealth : null;
  const { data, isLoading, error, mutate } = useSWR<BotModelsHealthResponse>(
    key,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      botModelsHealth: data?.data ?? null,
      botModelsHealthLoading: isLoading,
      botModelsHealthError: error,
      botModelsHealthMutate: mutate,
    }),
    [data, isLoading, error, mutate],
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
