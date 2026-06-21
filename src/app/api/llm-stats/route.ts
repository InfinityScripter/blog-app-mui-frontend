import { NextResponse } from "next/server";
import { runAdapters } from "src/server/llm-stats/scan";
import { aggregate } from "src/server/llm-stats/aggregate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    const { events, harnessesAvailable, scannedFiles, warnings } =
      runAdapters();
    const allWarnings = harnessesAvailable.length
      ? warnings
      : [
          ...warnings,
          "No local harness data found on this host (expected on production).",
        ];
    const bundle = aggregate(
      events,
      harnessesAvailable,
      scannedFiles,
      allWarnings,
    );
    return NextResponse.json(bundle);
  } catch (err) {
    // Never 500 the page: on any unexpected failure (e.g. native module load on
    // a serverless host) return a valid empty bundle so the dashboard shows its
    // empty state instead of hanging on "Загрузка…".
    const bundle = aggregate([], [], 0, [
      `scan failed: ${(err as Error).message}`,
    ]);
    return NextResponse.json(bundle);
  }
}
