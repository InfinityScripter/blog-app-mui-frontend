import "dayjs/locale/ru";
import { it, expect, describe } from "vitest";

import { EXPERIENCE } from "../const";
import ru from "../../../../../messages/ru.json";
import en from "../../../../../messages/en.json";
import { getPeriodLabel, getSortedExperience } from "../utils";

describe("getPeriodLabel", () => {
  const item = EXPERIENCE.find((e) => e.key === "stomplan")!;

  it("formats dates in the requested locale", () => {
    expect(getPeriodLabel(item, "present", "en")).toBe("May 2024 — April 2025");
    expect(getPeriodLabel(item, "настоящее время", "ru")).toBe(
      "май 2024 — апрель 2025",
    );
  });

  it("uses the present label for open-ended roles", () => {
    const current = EXPERIENCE.find((e) => e.key === "yandexGo")!;
    expect(getPeriodLabel(current, "present", "en")).toBe(
      "April 2025 — present",
    );
  });
});

describe("getSortedExperience", () => {
  it("puts the newest role first", () => {
    expect(getSortedExperience()[0].key).toBe("yandexGo");
  });
});

describe("experience copy", () => {
  it.each([
    ["ru", ru],
    ["en", en],
  ])("has localized copy for every role in %s", (_, messages) => {
    EXPERIENCE.forEach(({ key }) => {
      const copy = messages.home.experience.items[key];
      expect(copy.position).toBeTruthy();
      expect(copy.company).toBeTruthy();
      expect(copy.location).toBeTruthy();
      expect(copy.description.length).toBeGreaterThan(0);
    });
  });
});
