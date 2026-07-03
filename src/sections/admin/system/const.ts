// Пороговые значения занятости ресурса: до warning — зелёный, дальше —
// оранжевый, после error — красный (стандартные пороги мониторинга).
export const USAGE_WARNING_PERCENT = 70;
export const USAGE_ERROR_PERCENT = 85;

// Интервал автообновления метрик (SWR refreshInterval).
export const METRICS_REFRESH_INTERVAL_MS = 15_000;

// Сколько точек держим в клиентской истории чарта (15 с × 60 = 15 минут).
export const HISTORY_MAX_POINTS = 60;
