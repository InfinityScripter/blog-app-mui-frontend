import { it, expect, describe } from "vitest";

import { fRub, ymLabel, fRubShort } from "../utils";

describe("finance utils", () => {
  it("formats rubles with ru-RU grouping", () => {
    expect(fRub(84251)).toBe(`${(84251).toLocaleString("ru-RU")} ₽`);
    expect(fRub(0)).toBe("0 ₽");
  });

  it("shortens large amounts to тыс and млн", () => {
    expect(fRubShort(2_500_000)).toContain("млн ₽");
    expect(fRubShort(84_251)).toContain("тыс ₽");
    expect(fRubShort(999)).toContain("₽");
  });

  it("renders month labels in Russian", () => {
    expect(ymLabel("2026-07")).toBe("июл 26");
    expect(ymLabel("2025-01")).toBe("янв 25");
    expect(ymLabel("broken")).toBe("broken");
  });
});
