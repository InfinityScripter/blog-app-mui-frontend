import type { LlmStats } from "src/sections/admin/llm-stats/types";

import useSWR from "swr";
import { useMemo } from "react";
import { fetcher, endpoints } from "src/utils/axios";

interface SnapshotResponse {
  data?: {
    bundle: LlmStats | null;
    pushedAt: string | null;
  };
}

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: true,
};

export function useGetLlmStats() {
  const { data, isLoading, error } = useSWR<SnapshotResponse>(
    endpoints.admin.llmStats.snapshot,
    fetcher,
    swrOptions,
  );

  return useMemo(
    () => ({
      stats: data?.data?.bundle ?? null,
      pushedAt: data?.data?.pushedAt ?? null,
      statsLoading: isLoading,
      statsError: error,
    }),
    [data, isLoading, error],
  );
}
