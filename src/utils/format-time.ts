import dayjs from "dayjs";
import "dayjs/locale/ru";
import relativeTime from "dayjs/plugin/relativeTime";
import { DEFAULT_LOCALE, type AppLocale } from "src/i18n/locales";

// ----------------------------------------------------------------------

dayjs.extend(relativeTime);
// The original locale is Russian — dates read "20 июня 2026", not "20 Jun 2026".
// This global default keeps every caller that passes no locale unchanged;
// callers on a localized page pass theirs to fDate instead.
dayjs.locale("ru");

/**
 * Docs: https://day.js.org/docs/en/display/format
 */
export const formatStr = {
  dateTime: "D MMMM YYYY HH:mm", // 17 апреля 2022 14:30
  date: "D MMMM YYYY", // 17 апреля 2022
  time: "HH:mm", // 14:30
  split: {
    dateTime: "DD/MM/YYYY HH:mm", // 17/04/2022 14:30
    date: "DD/MM/YYYY", // 17/04/2022
  },
  paramCase: {
    dateTime: "DD-MM-YYYY HH:mm", // 17-04-2022 14:30
    date: "DD-MM-YYYY", // 17-04-2022
  },
};

// ----------------------------------------------------------------------

type DateInput = string | number | Date | dayjs.Dayjs | null | undefined;

/**
 * output: 17 апреля 2022 (or "17 April 2022" for `locale: "en"`)
 *
 * `locale` is applied to THIS value only, never through `dayjs.locale()`: that
 * setter is global, so an English page would flip the language of dates for
 * every request being rendered at the same time. Omitting it keeps the original
 * (Russian) rendering, so untouched callers behave exactly as before.
 */
export function fDate(
  date: DateInput,
  locale?: AppLocale,
  format?: string,
): string | null {
  if (!date) {
    return null;
  }

  const value = dayjs(date).locale(locale ?? DEFAULT_LOCALE);

  return value.isValid()
    ? value.format(format ?? formatStr.date)
    : "Invalid time value";
}

// ----------------------------------------------------------------------

/**
 * output: несколько секунд, 2 года (or "a few seconds", "2 years" for `"en"`)
 *
 * Same per-value locale rule as fDate — never the global `dayjs.locale()`.
 */
export function fToNow(
  date: DateInput,
  locale: AppLocale = DEFAULT_LOCALE,
): string | null {
  if (!date) {
    return null;
  }

  const value = dayjs(date).locale(locale);

  return value.isValid() ? value.toNow(true) : "Invalid time value";
}
