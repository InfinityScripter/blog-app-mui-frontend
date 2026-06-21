import { NextResponse } from "next/server";
import { runAdapters } from "src/server/llm-stats/scan";
import { aggregate } from "src/server/llm-stats/aggregate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const { events, harnessesAvailable, scannedFiles, warnings } = runAdapters();
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
}
