import type { SystemMetrics } from "src/sections/admin/system/types";

import useSWR from "swr";
import { useMemo } from "react";
import { fetcher, endpoints } from "src/utils/axios";
import { METRICS_REFRESH_INTERVAL_MS } from "src/sections/admin/system/const";

interface SystemMetricsResponse {
  data?: SystemMetrics;
}

const swrOptions = {
  revalidateOnFocus: false,
  keepPreviousData: true,
  refreshInterval: METRICS_REFRESH_INTERVAL_MS,
  // Мониторинг поллим и в фоновой вкладке: история продолжает копиться,
  // при возврате на вкладку данные уже свежие (payload крошечный).
  refreshWhenHidden: true,
};

export function useGetSystemMetrics(enabled = true) {
  // Cookie auth (axios withCredentials). Gate on `enabled` (authenticated) so
  // the poll doesn't fire before login; null key → SWR skips it.
  const key = enabled ? endpoints.admin.systemMetrics : null;
  const { data, isLoading, error, mutate } = useSWR<SystemMetricsResponse>(
    key,
    fetcher,
    swrOptions,
  );
  return useMemo(
    () => ({
      metrics: data?.data ?? null,
      metricsLoading: isLoading,
      metricsError: error,
      metricsMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}
