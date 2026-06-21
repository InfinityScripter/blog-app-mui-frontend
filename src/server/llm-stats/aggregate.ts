import type {
  HarnessId,
  ModelStat,
  UsageEvent,
  StatsBundle,
} from "src/server/llm-stats/types";

function tokensOf(e: UsageEvent): number {
  return e.tokensIn + e.tokensOut + e.cacheRead + e.cacheWrite;
}

function topCounts(
  pairs: (string | null)[],
): { name: string; count: number }[] {
  const m = new Map<string, number>();
  pairs.forEach((p) => {
    if (p) m.set(p, (m.get(p) ?? 0) + 1);
  });
  return Array.from(m.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function aggregate(
  events: UsageEvent[],
  harnessesAvailable: HarnessId[],
  scannedFiles: number,
  warnings: string[],
): StatsBundle {
  const byHarness = new Map<
    HarnessId,
    { tokens: number; requests: number; costUsd: number }
  >();
  const byFamily = new Map<
    string,
    { tokens: number; requests: number; costUsd: number }
  >();
  const byModel = new Map<string, ModelStat>();
  const byProject = new Map<string, { tokens: number; requests: number }>();
  const trend = new Map<
    string,
    { tokens: number; costUsd: number; byHarness: Record<string, number> }
  >();
  const heat = new Map<string, number>();
  const sessions = new Set<string>();
  const days = new Set<string>();

  const totals = events.reduce(
    (acc, e) => {
      const t = tokensOf(e);
      acc.totalTokens += t;
      acc.totalCostUsd += e.costUsd ?? 0;
      if (e.sessionId) sessions.add(`${e.harness}:${e.sessionId}`);
      days.add(e.dateKey);

      const h = byHarness.get(e.harness) ?? {
        tokens: 0,
        requests: 0,
        costUsd: 0,
      };
      byHarness.set(e.harness, {
        tokens: h.tokens + t,
        requests: h.requests + 1,
        costUsd: h.costUsd + (e.costUsd ?? 0),
      });

      const f = byFamily.get(e.modelFamily) ?? {
        tokens: 0,
        requests: 0,
        costUsd: 0,
      };
      byFamily.set(e.modelFamily, {
        tokens: f.tokens + t,
        requests: f.requests + 1,
        costUsd: f.costUsd + (e.costUsd ?? 0),
      });

      const ms = byModel.get(e.model) ?? {
        model: e.model,
        provider: e.provider,
        modelFamily: e.modelFamily,
        requests: 0,
        tokensIn: 0,
        tokensOut: 0,
        cacheRead: 0,
        cacheWrite: 0,
        costUsd: 0,
      };
      byModel.set(e.model, {
        ...ms,
        requests: ms.requests + 1,
        tokensIn: ms.tokensIn + e.tokensIn,
        tokensOut: ms.tokensOut + e.tokensOut,
        cacheRead: ms.cacheRead + e.cacheRead,
        cacheWrite: ms.cacheWrite + e.cacheWrite,
        costUsd: (ms.costUsd ?? 0) + (e.costUsd ?? 0),
      });

      if (e.project) {
        const p = byProject.get(e.project) ?? { tokens: 0, requests: 0 };
        byProject.set(e.project, {
          tokens: p.tokens + t,
          requests: p.requests + 1,
        });
      }

      const tr = trend.get(e.dateKey) ?? {
        tokens: 0,
        costUsd: 0,
        byHarness: {},
      };
      trend.set(e.dateKey, {
        tokens: tr.tokens + t,
        costUsd: tr.costUsd + (e.costUsd ?? 0),
        byHarness: {
          ...tr.byHarness,
          [e.harness]: (tr.byHarness[e.harness] ?? 0) + t,
        },
      });

      const hk = `${e.weekday}:${e.hour}`;
      heat.set(hk, (heat.get(hk) ?? 0) + t);

      if (e.harness === "claude-code") {
        acc.ccCacheRead += e.cacheRead;
        acc.ccCacheTotal += e.cacheRead + e.tokensIn;
        if (e.agent) acc.agentEvents += 1;
      }
      return acc;
    },
    {
      totalTokens: 0,
      totalCostUsd: 0,
      ccCacheRead: 0,
      ccCacheTotal: 0,
      agentEvents: 0,
    },
  );

  const harnessArr = Array.from(byHarness.entries())
    .map(([harness, v]) => ({ harness, ...v }))
    .sort((a, b) => b.tokens - a.tokens);
  const familyArr = Array.from(byFamily.entries())
    .map(([family, v]) => ({ family, ...v }))
    .sort((a, b) => b.tokens - a.tokens);
  const projectArr = Array.from(byProject.entries())
    .map(([project, v]) => ({ project, ...v }))
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, 15);
  const trendArr = Array.from(trend.entries())
    .map(([dateKey, v]) => ({ dateKey, ...v }))
    .sort((a, b) => (a.dateKey < b.dateKey ? -1 : 1));
  const heatArr = Array.from(heat.entries()).map(([k, tokens]) => {
    const [weekday, hour] = k.split(":").map(Number);
    return { weekday, hour, tokens };
  });

  const ccEvents = events.filter((e) => e.harness === "claude-code");
  const claudeExtras = ccEvents.length
    ? {
        topSkills: topCounts(ccEvents.map((e) => e.skill)),
        topMcpTools: topCounts(ccEvents.map((e) => e.mcpTool)),
        cacheHitRatio:
          totals.ccCacheTotal > 0
            ? totals.ccCacheRead / totals.ccCacheTotal
            : 0,
        agentEvents: totals.agentEvents,
      }
    : null;

  return {
    kpis: {
      totalTokens: totals.totalTokens,
      totalCostUsd: totals.totalCostUsd,
      sessions: sessions.size,
      activeDays: days.size,
      topModelFamily: familyArr[0]?.family ?? null,
      topHarness: harnessArr[0]?.harness ?? null,
    },
    byModelFamily: familyArr,
    byModel: Array.from(byModel.values()).sort(
      (a, b) => b.tokensIn + b.tokensOut - (a.tokensIn + a.tokensOut),
    ),
    byHarness: harnessArr,
    byProject: projectArr,
    trend: trendArr,
    heatmap: heatArr,
    claudeExtras,
    meta: {
      generatedAt: new Date().toISOString(),
      scannedFiles,
      harnessesAvailable,
      warnings,
    },
  };
}
