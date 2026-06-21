import type { useGetLlmStats } from "src/actions/llm-stats";

export function renderState(
  statsError: unknown,
  statsLoading: boolean,
  stats: ReturnType<typeof useGetLlmStats>["stats"],
): "error" | "loading" | "empty" | "ready" {
  if (statsError) return "error";
  if (statsLoading) return "loading";
  if (!stats) return "empty";
  return "ready";
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}
