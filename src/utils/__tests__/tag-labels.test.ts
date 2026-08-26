import { it, expect, describe } from "vitest";
import { tagLabel } from "src/utils/tag-labels";

describe("tagLabel", () => {
  it("переводит известный тег на английский", () => {
    expect(tagLabel("новости", "en")).toBe("News");
    expect(tagLabel("нейросети", "en")).toBe("Neural networks");
  });

  it("на русском отдаёт тег как есть — он и есть оригинал", () => {
    expect(tagLabel("новости", "ru")).toBe("новости");
    expect(tagLabel("наука и техника", "ru")).toBe("наука и техника");
  });

  it("незнакомый тег отдаёт как есть, а не пустую строку", () => {
    // Бот придумывает новые теги сам, и словарь всегда будет отставать.
    // Показать русский тег хуже, чем перевод, но несравнимо лучше, чем дыру.
    expect(tagLabel("квантовые вычисления", "en")).toBe("квантовые вычисления");
  });

  it("уже английский тег не трогает", () => {
    expect(tagLabel("ai", "en")).toBe("ai");
    expect(tagLabel("claude code", "en")).toBe("claude code");
  });

  it("не зависит от регистра исходного тега", () => {
    expect(tagLabel("Новости", "en")).toBe("News");
  });
});
