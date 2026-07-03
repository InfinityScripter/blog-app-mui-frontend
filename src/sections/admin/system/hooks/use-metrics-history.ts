import { useRef, useState, useEffect } from "react";

import { HISTORY_MAX_POINTS } from "../const";

import type { SystemMetrics, MetricsHistoryPoint } from "../types";

// Копит клиентскую историю CPU/RAM с момента открытия страницы: SWR каждые
// 15 с приносит свежий снапшот, новая точка добавляется только на новый
// server-side timestamp (refocus/ретраи не дублируют точки).
export function useMetricsHistory(
  metrics: SystemMetrics | null,
): MetricsHistoryPoint[] {
  const [history, setHistory] = useState<MetricsHistoryPoint[]>([]);
  const lastTimestampRef = useRef<string | null>(null);

  useEffect(() => {
    if (!metrics) return;
    if (lastTimestampRef.current === metrics.host.timestamp) return;
    lastTimestampRef.current = metrics.host.timestamp;
    const point: MetricsHistoryPoint = {
      at: new Date(metrics.host.timestamp).getTime(),
      cpuPercent: metrics.cpu.usagePercent,
      memPercent: metrics.memory.usedPercent,
    };
    setHistory((prev) => [...prev, point].slice(-HISTORY_MAX_POINTS));
  }, [metrics]);

  return history;
}
