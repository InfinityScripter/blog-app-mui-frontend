import type { FetcherArgs } from "src/utils/axios";
import type { FinanceSummary, FinanceImportResult } from "src/types/finance";

import useSWR from "swr";
import { useMemo } from "react";
import axiosInstance, { fetcher, endpoints } from "src/utils/axios";

interface SummaryResponse {
  data?: FinanceSummary;
}

interface ImportResponse {
  data: FinanceImportResult;
}

export interface FinanceRange {
  from?: string;
  to?: string;
}

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: true,
  // Смена диапазона — это новый SWR-ключ; без keepPreviousData вся панель
  // на время рефетча размонтируется до «Загрузка…» вместе с самим селектором.
  keepPreviousData: true,
};

export function useGetFinanceSummary(range: FinanceRange) {
  const hasRange = Boolean(range.from ?? range.to);
  const key: FetcherArgs = hasRange
    ? [endpoints.finance.summary, { params: range }]
    : endpoints.finance.summary;
  const { data, isLoading, error, mutate } = useSWR<SummaryResponse>(
    key,
    fetcher,
    swrOptions,
  );

  return useMemo(
    () => ({
      summary: data?.data ?? null,
      summaryLoading: isLoading,
      summaryError: error,
      summaryMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );
}

export async function importFinanceCsv(
  csv: string,
  filename?: string,
): Promise<FinanceImportResult> {
  const res = await axiosInstance.post<ImportResponse>(
    endpoints.finance.import,
    { csv, filename },
  );
  return res.data.data;
}

export async function fetchFinanceExport(params: {
  from?: string;
  to?: string;
  format: "csv" | "json";
}): Promise<Blob> {
  const res = await axiosInstance.get<Blob>(endpoints.finance.export, {
    params,
    responseType: "blob",
  });
  return res.data;
}
