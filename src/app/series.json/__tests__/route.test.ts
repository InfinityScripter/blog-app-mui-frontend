import { it, expect } from "vitest";
import { SERIES_LESSONS } from "src/sections/home/home-series/data/lessons";

import { GET } from "../route";

it("serves the series lessons as JSON for the news bot", async () => {
  const response = GET();

  expect(response.headers.get("content-type")).toContain("application/json");
  await expect(response.json()).resolves.toEqual({ lessons: SERIES_LESSONS });
});
