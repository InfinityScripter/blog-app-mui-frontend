import type { LlmStatsResponse } from "src/sections/admin/llm-stats/types";

import useSWR from "swr";
import { useMemo } from "react";

const jsonFetcher = (url: string): Promise<LlmStatsResponse> =>
  fetch(url).then((r) => r.json() as Promise<LlmStatsResponse>);

export function useGetLlmStats() {
  const { data, isLoading, error } = useSWR<LlmStatsResponse>(
    "/api/llm-stats",
    jsonFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return useMemo(
    () => ({ stats: data ?? null, statsLoading: isLoading, statsError: error }),
    [data, isLoading, error],
  );
}
