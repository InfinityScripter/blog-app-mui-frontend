// Типы ответа GET /api/admin/system-metrics (зеркало бэкенд-сервиса
// system-metrics). Поля с | null — метрики, которые бэкенд собирает
// best-effort и отдаёт null, когда источник недоступен.

export interface SystemMetricsCpu {
  cores: number;
  loadAvg: number[];
  usagePercent: number | null;
}

export interface SystemMetricsSwap {
  totalBytes: number;
  usedBytes: number;
  usedPercent: number;
}

export interface SystemMetricsMemory {
  totalBytes: number;
  usedBytes: number;
  availableBytes: number;
  usedPercent: number;
  swap: SystemMetricsSwap | null;
}

export interface SystemMetricsDisk {
  mount: string;
  totalBytes: number;
  usedBytes: number;
  availableBytes: number;
  usedPercent: number;
  inodesUsedPercent: number | null;
}

export interface SystemMetricsHost {
  hostname: string;
  platform: string;
  kernel: string;
  distro: string | null;
  uptimeSeconds: number;
  timestamp: string;
}

export interface SystemMetricsProcess {
  pid: number;
  nodeVersion: string;
  uptimeSeconds: number;
  rssBytes: number;
  heapUsedBytes: number;
  heapTotalBytes: number;
}

export interface SystemMetricsDatabase {
  sizeBytes: number | null;
  activeConnections: number | null;
}

export interface SystemMetrics {
  host: SystemMetricsHost;
  cpu: SystemMetricsCpu;
  memory: SystemMetricsMemory;
  disk: SystemMetricsDisk | null;
  process: SystemMetricsProcess;
  database: SystemMetricsDatabase;
}

/** Точка клиентской истории для чарта динамики (копится с открытия страницы). */
export interface MetricsHistoryPoint {
  at: number;
  cpuPercent: number | null;
  memPercent: number;
}

export interface MetricDetailRow {
  label: string;
  value: string;
}
