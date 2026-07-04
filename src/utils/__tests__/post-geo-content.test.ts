import { it, expect, describe } from "vitest";
import {
  parsePostContent,
  isMeaningfullyUpdated,
} from "src/utils/post-geo-content";

// ----------------------------------------------------------------------

describe("parsePostContent", () => {
  it("returns empty body and no faq for empty input", () => {
    expect(parsePostContent(undefined)).toEqual({ body: "", faq: [] });
    expect(parsePostContent("")).toEqual({ body: "", faq: [] });
    expect(parsePostContent("   ")).toEqual({ body: "", faq: [] });
  });

  it("keeps the whole body and no faq when there is no FAQ section", () => {
    const md = "## Введение\n\nТекст статьи.\n\n### Подзаголовок\n\nЕщё текст.";
    const { body, faq } = parsePostContent(md);
    expect(faq).toEqual([]);
    expect(body).toContain("## Введение");
    expect(body).toContain("### Подзаголовок");
  });

  it("splits a `## FAQ` section into question/answer pairs", () => {
    const md = [
      "Тело статьи.",
      "",
      "## FAQ",
      "",
      "### Сколько стоит?",
      "",
      "15 долларов за миллион токенов.",
      "",
      "### Есть ли локализация?",
      "",
      "Нет, только английский.",
    ].join("\n");
    const { body, faq } = parsePostContent(md);
    expect(body).toContain("Тело статьи.");
    expect(body).not.toContain("## FAQ");
    expect(body).not.toContain("Сколько стоит?");
    expect(faq).toHaveLength(2);
    expect(faq[0]).toEqual({
      question: "Сколько стоит?",
      answer: "15 долларов за миллион токенов.",
    });
    expect(faq[1].question).toBe("Есть ли локализация?");
    expect(faq[1].answer).toBe("Нет, только английский.");
  });

  it("accepts `## Частые вопросы` as a FAQ heading alias", () => {
    const md = "Тело.\n\n## Частые вопросы\n\n### Вопрос?\n\nОтвет.";
    const { faq } = parsePostContent(md);
    expect(faq).toHaveLength(1);
    expect(faq[0].question).toBe("Вопрос?");
  });

  it("matches the FAQ heading case-insensitively", () => {
    const md = "Тело.\n\n## faq\n\n### Вопрос?\n\nОтвет.";
    const { faq } = parsePostContent(md);
    expect(faq).toHaveLength(1);
  });

  it("stops the FAQ section at the next `##` heading and keeps that in body", () => {
    const md = [
      "Тело.",
      "",
      "## FAQ",
      "",
      "### Вопрос?",
      "",
      "Ответ.",
      "",
      "## Заключение",
      "",
      "Финальный абзац.",
    ].join("\n");
    const { body, faq } = parsePostContent(md);
    expect(faq).toHaveLength(1);
    expect(faq[0].question).toBe("Вопрос?");
    expect(body).toContain("## Заключение");
    expect(body).toContain("Финальный абзац.");
    expect(body).not.toContain("### Вопрос?");
  });

  it("keeps a multi-paragraph / list answer intact as markdown", () => {
    const md = [
      "## FAQ",
      "",
      "### Как настроить?",
      "",
      "Три шага:",
      "",
      "- Первый",
      "- Второй",
      "",
      "Готово.",
    ].join("\n");
    const { faq } = parsePostContent(md);
    expect(faq).toHaveLength(1);
    expect(faq[0].answer).toContain("- Первый");
    expect(faq[0].answer).toContain("- Второй");
    expect(faq[0].answer).toContain("Готово.");
  });

  it("drops questions that have no answer body", () => {
    const md = "## FAQ\n\n### Пустой вопрос?\n\n### Реальный вопрос?\n\nОтвет.";
    const { faq } = parsePostContent(md);
    expect(faq).toHaveLength(1);
    expect(faq[0].question).toBe("Реальный вопрос?");
  });

  it("normalises HTML (Tiptap) input to markdown before parsing", () => {
    const html =
      "<p>Тело статьи.</p><h2>FAQ</h2><h3>Сколько стоит?</h3><p>15 долларов.</p>";
    const { body, faq } = parsePostContent(html);
    expect(faq).toHaveLength(1);
    expect(faq[0].question).toBe("Сколько стоит?");
    expect(faq[0].answer).toContain("15 долларов");
    expect(body).toContain("Тело статьи.");
    expect(body).not.toContain("FAQ");
  });

  it("returns no faq when the FAQ section has no `###` questions", () => {
    const md = "Тело.\n\n## FAQ\n\nПросто абзац без вопросов.";
    const { faq } = parsePostContent(md);
    expect(faq).toEqual([]);
  });
});

// ----------------------------------------------------------------------

describe("isMeaningfullyUpdated", () => {
  it("is false when updatedAt is missing", () => {
    expect(isMeaningfullyUpdated("2026-06-01T00:00:00Z", undefined)).toBe(
      false,
    );
  });

  it("is false when updatedAt equals createdAt", () => {
    const t = "2026-06-01T00:00:00Z";
    expect(isMeaningfullyUpdated(t, t)).toBe(false);
  });

  it("is false when the gap is under 24h", () => {
    expect(
      isMeaningfullyUpdated("2026-06-01T00:00:00Z", "2026-06-01T10:00:00Z"),
    ).toBe(false);
  });

  it("is true when updatedAt is more than 24h after createdAt", () => {
    expect(
      isMeaningfullyUpdated("2026-06-01T00:00:00Z", "2026-06-03T00:00:00Z"),
    ).toBe(true);
  });

  it("is false when createdAt is missing (nothing to compare)", () => {
    expect(isMeaningfullyUpdated(undefined, "2026-06-03T00:00:00Z")).toBe(
      false,
    );
  });
});
