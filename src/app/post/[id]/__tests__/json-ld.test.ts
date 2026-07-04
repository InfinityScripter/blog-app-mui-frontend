import { it, expect, describe } from "vitest";

import { buildFaqJsonLd } from "../json-ld";

// ----------------------------------------------------------------------

describe("buildFaqJsonLd", () => {
  it("returns null for an empty FAQ list", () => {
    expect(buildFaqJsonLd([])).toBeNull();
  });

  it("builds a FAQPage with one Question per item", () => {
    const jsonLd = buildFaqJsonLd([
      { question: "Сколько стоит?", answer: "15 долларов." },
      { question: "Есть локализация?", answer: "Нет." },
    ]);
    expect(jsonLd).not.toBeNull();
    expect(jsonLd?.["@type"]).toBe("FAQPage");
    expect(jsonLd?.mainEntity).toHaveLength(2);
    expect(jsonLd?.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Сколько стоит?",
      acceptedAnswer: { "@type": "Answer", text: "15 долларов." },
    });
  });

  it("strips markdown from the answer text (schema.org renders plain text)", () => {
    const jsonLd = buildFaqJsonLd([
      {
        question: "Как?",
        answer: "**Жирный** текст со [ссылкой](https://x.io) и `кодом`.",
      },
    ]);
    expect(jsonLd?.mainEntity[0].acceptedAnswer.text).toBe(
      "Жирный текст со ссылкой и кодом.",
    );
  });

  it("flattens a list answer into one line of plain text", () => {
    const jsonLd = buildFaqJsonLd([
      {
        question: "Шаги?",
        answer: "Три шага:\n\n- Первый\n- Второй\n\nГотово.",
      },
    ]);
    expect(jsonLd?.mainEntity[0].acceptedAnswer.text).toBe(
      "Три шага: Первый Второй Готово.",
    );
  });

  it("drops a fenced code block from the answer text", () => {
    const jsonLd = buildFaqJsonLd([
      {
        question: "Пример?",
        answer: "Вот код:\n\n```js\nconst x = 1;\n```\n\nВсё.",
      },
    ]);
    const text = jsonLd?.mainEntity[0].acceptedAnswer.text ?? "";
    expect(text).toContain("Вот код:");
    expect(text).toContain("Всё.");
    expect(text).not.toContain("const x");
  });
});
