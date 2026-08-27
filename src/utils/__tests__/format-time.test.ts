import { it, expect, describe } from "vitest";
import { fDate, fToNow } from "src/utils/format-time";

// Без «Z»: dayjs трактует строку как локальное время, и полдень 15-го числа
// остаётся 15-м в любой таймзоне раннера. UTC-инстант (…T09:00Z) на машине
// западнее UTC−9 рендерился бы 14-м числом, и тесты падали бы на верном коде.
const DAY = "2026-08-15T12:00:00";

describe("fDate — язык даты", () => {
  it("без локали остаётся русской — прежнее поведение не меняется", () => {
    expect(fDate(DAY)).toBe("15 августа 2026");
  });

  it("для английской локали пишет месяц по-английски", () => {
    expect(fDate(DAY, "en")).toBe("15 August 2026");
  });

  it("для русской локали пишет месяц по-русски", () => {
    expect(fDate(DAY, "ru")).toBe("15 августа 2026");
  });

  it("не превращает локаль в глобальную настройку — соседний вызов не заражается", () => {
    // dayjs.locale() меняет язык глобально, поэтому локаль обязана
    // применяться к отдельному значению, иначе английская страница
    // переключила бы язык дат для всех параллельных запросов.
    fDate(DAY, "en");
    expect(fDate(DAY)).toBe("15 августа 2026");
  });

  it("явный формат по-прежнему работает", () => {
    expect(fDate(DAY, "ru", "DD/MM/YYYY")).toBe("15/08/2026");
    expect(fDate(DAY, "en", "MMMM")).toBe("August");
  });

  it("пустая дата — null, битая — понятная строка", () => {
    expect(fDate(null)).toBeNull();
    expect(fDate("не дата", "en")).toBe("Invalid time value");
  });
});

describe("fToNow — язык относительного времени", () => {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  it("без локали остаётся русским", () => {
    expect(fToNow(twoDaysAgo)).toBe("2 дня");
  });

  it("для английской локали пишет по-английски", () => {
    expect(fToNow(twoDaysAgo, "en")).toBe("2 days");
  });

  it("соседний вызов не заражается английской локалью", () => {
    fToNow(twoDaysAgo, "en");
    expect(fToNow(twoDaysAgo)).toBe("2 дня");
  });
});
