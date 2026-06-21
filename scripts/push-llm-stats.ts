import { runAdapters } from "../src/server/llm-stats/scan";
/**
 * Scan local AI-harness logs, aggregate, strip project names, and push the
 * snapshot to the backend so the prod dashboard can render it.
 *
 * Usage:
 *   LLM_STATS_PUSH_TOKEN=<admin-jwt> SERVER_URL=https://api.talalaev.su:8444 \
 *     npx tsx scripts/push-llm-stats.ts
 *
 * Or with admin credentials instead of a token:
 *   LLM_STATS_ADMIN_EMAIL=... LLM_STATS_ADMIN_PASSWORD=... SERVER_URL=... \
 *     npx tsx scripts/push-llm-stats.ts
 *
 * SERVER_URL defaults to NEXT_PUBLIC_SERVER_URL or http://localhost:7272.
 */
import { aggregate } from "../src/server/llm-stats/aggregate";
import { sanitizeBundle } from "../src/server/llm-stats/sanitize";

function serverUrl(): string {
  return (
    process.env.SERVER_URL ??
    process.env.NEXT_PUBLIC_SERVER_URL ??
    "http://localhost:7272"
  );
}

async function getToken(base: string): Promise<string> {
  const token = process.env.LLM_STATS_PUSH_TOKEN;
  if (token) return token;

  const email = process.env.LLM_STATS_ADMIN_EMAIL;
  const password = process.env.LLM_STATS_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "Set LLM_STATS_PUSH_TOKEN, or LLM_STATS_ADMIN_EMAIL + LLM_STATS_ADMIN_PASSWORD.",
    );
  }
  const res = await fetch(`${base}/api/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(`Sign-in failed: ${res.status} ${await res.text()}`);
  }
  const data: unknown = await res.json();
  const accessToken =
    data && typeof data === "object" && "accessToken" in data
      ? (data as { accessToken?: string }).accessToken
      : undefined;
  if (!accessToken) throw new Error("Sign-in response had no accessToken");
  return accessToken;
}

async function main(): Promise<void> {
  const base = serverUrl();

  const { events, harnessesAvailable, scannedFiles, warnings } = runAdapters();
  if (!harnessesAvailable.length) {
    throw new Error(
      "No local harness data found — run this on the machine with ~/.claude etc.",
    );
  }
  const bundle = sanitizeBundle(
    aggregate(events, harnessesAvailable, scannedFiles, warnings),
  );

  const token = await getToken(base);
  const res = await fetch(`${base}/api/admin/llm-stats/snapshot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bundle),
  });
  if (!res.ok) {
    throw new Error(`Push failed: ${res.status} ${await res.text()}`);
  }
  const result: unknown = await res.json();
  const pushedAt =
    result && typeof result === "object" && "data" in result
      ? (result as { data?: { pushedAt?: string } }).data?.pushedAt
      : undefined;

  // eslint-disable-next-line no-console
  console.log(
    `Pushed snapshot: ${harnessesAvailable.join(", ")}, ` +
      `${events.length} events, ${scannedFiles} files. pushedAt=${pushedAt ?? "?"}`,
  );
}

main().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
