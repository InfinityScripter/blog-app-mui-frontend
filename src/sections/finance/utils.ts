import { MONTH_LABELS } from "src/sections/finance/const";

const RUB_FORMAT = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

export function fRub(value: number): string {
  return `${RUB_FORMAT.format(Math.round(value))} ₽`;
}

export function fRubShort(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн ₽`;
  }
  if (abs >= 10_000) {
    return `${RUB_FORMAT.format(Math.round(value / 1_000))} тыс ₽`;
  }
  return fRub(value);
}

// Операции хранятся с московским смещением — форматируем в той же зоне,
// иначе ночная покупка уезжает на сутки назад у тех, кто смотрит из другого
// часового пояса.
const OP_DATE_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

export function fOpDate(iso: string): string {
  return OP_DATE_FORMAT.format(new Date(iso));
}

export function ymLabel(ym: string): string {
  const [year, month] = ym.split("-");
  const label = MONTH_LABELS[Number(month) - 1];
  if (!label || !year) {
    return ym;
  }
  return `${label} ${year.slice(2)}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Отзывать URL синхронно после click() хрупко (Firefox может начать
  // загрузку асинхронно) — освобождаем на следующем тике.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// Т-Банк отдаёт CSV то в UTF-8, то в windows-1251 — определяем по тому,
// читается ли заголовок выписки.
export async function decodeStatementFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const utf8 = new TextDecoder("utf-8").decode(buffer);
  if (utf8.includes("Дата операции")) {
    return utf8;
  }
  return new TextDecoder("windows-1251").decode(buffer);
}
