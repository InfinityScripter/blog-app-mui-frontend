import type { useGetSystemMetrics } from "src/actions/system-metrics";

import { USAGE_ERROR_PERCENT, USAGE_WARNING_PERCENT } from "./const";

import type { SystemMetrics, MetricDetailRow } from "./types";

// ----------------------------------------------------------------------

export function renderState(
  metricsError: unknown,
  metricsLoading: boolean,
  metrics: ReturnType<typeof useGetSystemMetrics>["metrics"],
): "error" | "loading" | "ready" {
  if (metrics) return "ready";
  if (metricsError) return "error";
  return "loading";
}

export type UsageSeverity = "success" | "warning" | "error";

export function usageSeverity(percent: number | null): UsageSeverity {
  if (percent === null) return "success";
  if (percent >= USAGE_ERROR_PERCENT) return "error";
  if (percent >= USAGE_WARNING_PERCENT) return "warning";
  return "success";
}

// ----------------------------------------------------------------------

const BYTE_UNITS = ["Б", "КБ", "МБ", "ГБ", "ТБ"];

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 Б";
  const power = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1,
  );
  const value = bytes / 1024 ** power;
  const digits = value >= 100 || power === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${BYTE_UNITS[power]}`;
}

export function formatPercent(percent: number | null): string {
  return percent === null ? "—" : `${percent.toFixed(percent >= 100 ? 0 : 1)}%`;
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days} дн ${hours} ч`;
  if (hours > 0) return `${hours} ч ${minutes} мин`;
  return `${minutes} мин`;
}

export function formatClock(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("ru-RU");
}

// ----------------------------------------------------------------------
// Строители строк «label → value» для карточек: держат вёрстку view тонкой.

export function buildCpuDetails(metrics: SystemMetrics): MetricDetailRow[] {
  const { loadAvg, cores } = metrics.cpu;
  return [
    { label: "Load avg (1/5/15 мин)", value: loadAvg.map((n) => n.toFixed(2)).join(" · ") },
    { label: "Ядра", value: String(cores) },
  ];
}

export function buildMemoryDetails(metrics: SystemMetrics): MetricDetailRow[] {
  const { usedBytes, totalBytes, availableBytes, swap } = metrics.memory;
  const rows = [
    { label: "Занято", value: `${formatBytes(usedBytes)} из ${formatBytes(totalBytes)}` },
    { label: "Доступно", value: formatBytes(availableBytes) },
  ];
  return swap
    ? [
        ...rows,
        {
          label: "Swap",
          value: `${formatBytes(swap.usedBytes)} из ${formatBytes(swap.totalBytes)} (${formatPercent(swap.usedPercent)})`,
        },
      ]
    : rows;
}

export function buildDiskDetails(metrics: SystemMetrics): MetricDetailRow[] {
  const { disk } = metrics;
  if (!disk) return [];
  const rows = [
    { label: "Занято", value: `${formatBytes(disk.usedBytes)} из ${formatBytes(disk.totalBytes)}` },
    { label: "Свободно", value: formatBytes(disk.availableBytes) },
  ];
  return disk.inodesUsedPercent === null
    ? rows
    : [...rows, { label: "Inodes", value: formatPercent(disk.inodesUsedPercent) }];
}

export function buildSystemRows(metrics: SystemMetrics): MetricDetailRow[] {
  const { host } = metrics;
  return [
    { label: "Хост", value: host.hostname },
    { label: "ОС", value: host.distro ?? host.platform },
    { label: "Ядро", value: host.kernel },
    { label: "Аптайм", value: formatUptime(host.uptimeSeconds) },
    { label: "Время сервера", value: formatClock(host.timestamp) },
  ];
}

export function buildProcessRows(metrics: SystemMetrics): MetricDetailRow[] {
  const proc = metrics.process;
  return [
    { label: "Node.js", value: proc.nodeVersion },
    { label: "PID", value: String(proc.pid) },
    { label: "RSS", value: formatBytes(proc.rssBytes) },
    {
      label: "Heap",
      value: `${formatBytes(proc.heapUsedBytes)} из ${formatBytes(proc.heapTotalBytes)}`,
    },
    { label: "Аптайм процесса", value: formatUptime(proc.uptimeSeconds) },
  ];
}

export function buildDatabaseRows(metrics: SystemMetrics): MetricDetailRow[] {
  const { sizeBytes, activeConnections } = metrics.database;
  return [
    { label: "Размер БД", value: sizeBytes === null ? "—" : formatBytes(sizeBytes) },
    {
      label: "Активные подключения",
      value: activeConnections === null ? "—" : String(activeConnections),
    },
  ];
}
