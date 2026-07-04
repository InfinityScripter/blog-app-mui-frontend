// ----------------------------------------------------------------------

// Локаль Intl-форматирования чисел. Runtime-i18n в приложении нет, поэтому
// локаль фиксированная (раньше её отдавал неинициализированный i18next и она
// всё равно всегда сводилась к en-US).
const DEFAULT_LOCALE = { code: "en-US", currency: "USD" };

interface Locale {
  code: string;
  currency: string;
}

interface NumberFormatOptions extends Intl.NumberFormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

function resolveLocale(): Locale {
  return DEFAULT_LOCALE;
}

function processInput(inputValue: unknown): number | null {
  if (inputValue == null || Number.isNaN(inputValue)) return null;
  return Number(inputValue);
}

// ----------------------------------------------------------------------

export function fShortenNumber(
  inputValue: unknown,
  options?: NumberFormatOptions,
): string {
  const locale = resolveLocale();

  const number = processInput(inputValue);
  if (number === null) return "";

  const fm = new Intl.NumberFormat(locale.code, {
    notation: "compact",
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm.replace(/[A-Z]/g, (match) => match.toLowerCase());
}

// ----------------------------------------------------------------------

export function fData(inputValue: unknown): string {
  const number = processInput(inputValue);
  if (number === null || number === 0) return "0 bytes";

  const units = ["bytes", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
  const decimal = 2;
  const baseValue = 1024;

  const index = Math.floor(Math.log(number) / Math.log(baseValue));
  const fm = `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`;

  return fm;
}
