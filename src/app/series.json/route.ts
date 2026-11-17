import { SERIES_LESSONS } from "src/sections/home/home-series/data/lessons";

export const dynamic = "force-static";

export function GET() {
  const lessons = SERIES_LESSONS.map(
    ({ slug: _slug, intro: _intro, ...lesson }) => lesson,
  );
  return Response.json({ lessons });
}
