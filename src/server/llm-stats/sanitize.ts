import type { StatsBundle } from "src/server/llm-stats/types";

// Strip data that must not leave the local machine before a snapshot is pushed
// to the public backend. Currently: project names (byProject) — they include
// work repos (Arcadia/tef) and must not appear on a public site. Everything
// else (models, harnesses, time, cost, skills, MCP tools, cache) is aggregate
// and safe to publish.
export function sanitizeBundle(bundle: StatsBundle): StatsBundle {
  return { ...bundle, byProject: [] };
}
