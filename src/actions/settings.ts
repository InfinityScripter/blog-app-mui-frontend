"use client";

import useSWR from "swr";
import { useMemo } from "react";
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";

// Runtime feature flags, read from the backend (app_settings table) so an admin
// can toggle them without a redeploy. The public endpoint exposes only the flags
// that gate public UI; the admin endpoint returns the full snapshot and the
// toggle mutates it. Envelope is ok() → { success, data: { ... } }, so the
// payload lives under res.data.data.

export interface PublicSettings {
  pdCollection: boolean;
}

interface PublicSettingsResponse {
  data: PublicSettings;
}

interface AdminSettingsResponse {
  data: { flags: PublicSettings };
}

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// Public flag read used by CTA/gate components on public pages. No auth needed;
// always enabled. On a statically-rendered page this runs after hydration, so
// personal-data UI appears/disappears once the real flag lands.
export function useGetPublicSettings() {
  const { data, isLoading, error, mutate } = useSWR<PublicSettingsResponse>(
    endpoints.settings.public,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      settings: data?.data ?? null,
      settingsLoading: isLoading,
      settingsError: error,
      settingsMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}

// Admin flag snapshot for the dashboard settings page. Cookie auth (axios
// withCredentials) — gate on `enabled` (authenticated) like the bot hooks.
export function useGetAdminSettings(enabled = true) {
  const key = enabled ? endpoints.admin.settings : null;
  const { data, isLoading, error, mutate } = useSWR<AdminSettingsResponse>(
    key,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      flags: data?.data.flags ?? null,
      flagsLoading: isLoading,
      flagsError: error,
      flagsMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}

export async function setPdCollection(enabled: boolean) {
  await axiosInstance.post(endpoints.admin.pdCollection, { enabled });
}
