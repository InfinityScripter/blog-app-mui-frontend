import { SERIES_LESSONS } from "src/sections/home/home-series/data/lessons";

export const dynamic = "force-static";

export function GET() {
  return Response.json({ lessons: SERIES_LESSONS });
}
