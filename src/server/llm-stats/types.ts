export type HarnessId =
  | "claude-code"
  | "codex"
  | "opencode"
  | "cursor"
  | "gemini"
  | "continue"
  | "goose"
  | "copilot";

export interface UsageEvent {
  harness: HarnessId;
  provider: string;
  model: string;
  modelFamily: string;
  ts: string; // ISO-8601
  dateKey: string; // YYYY-MM-DD local
  weekday: number; // 0=Sun..6=Sat
  hour: number; // 0-23 local
  project: string | null;
  tokensIn: number;
  tokensOut: number;
  cacheRead: number;
  cacheWrite: number;
  reasoning: number;
  costUsd: number | null;
  sessionId: string | null;
  gitBranch: string | null;
  skill: string | null;
  mcpTool: string | null;
  agent: string | null;
}

export interface SourceAdapter {
  harness: HarnessId;
  isAvailable: () => boolean;
  scan: () => UsageEvent[];
}

export interface PriceRow {
  in: number; // USD per 1M input tokens
  out: number;
  cacheRead: number;
  cacheWrite: number;
}
export type PriceTable = Record<string, PriceRow>;

export interface ModelStat {
  model: string;
  provider: string;
  modelFamily: string;
  requests: number;
  tokensIn: number;
  tokensOut: number;
  cacheRead: number;
  cacheWrite: number;
  costUsd: number | null;
}

export interface StatsBundle {
  kpis: {
    totalTokens: number;
    totalCostUsd: number;
    sessions: number;
    activeDays: number;
    topModelFamily: string | null;
    topHarness: HarnessId | null;
  };
  byModelFamily: {
    family: string;
    tokens: number;
    requests: number;
    costUsd: number;
  }[];
  byModel: ModelStat[];
  byHarness: {
    harness: HarnessId;
    tokens: number;
    requests: number;
    costUsd: number;
  }[];
  byProject: { project: string; tokens: number; requests: number }[];
  trend: {
    dateKey: string;
    tokens: number;
    costUsd: number;
    byHarness: Record<string, number>;
  }[];
  heatmap: { weekday: number; hour: number; tokens: number }[];
  claudeExtras: {
    topSkills: { name: string; count: number }[];
    topMcpTools: { name: string; count: number }[];
    cacheHitRatio: number;
    agentEvents: number;
  } | null;
  meta: {
    generatedAt: string;
    scannedFiles: number;
    harnessesAvailable: HarnessId[];
    warnings: string[];
  };
}
