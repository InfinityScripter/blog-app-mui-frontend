import dayjs from "dayjs";
import "dayjs/locale/ru";
import relativeTime from "dayjs/plugin/relativeTime";

// ----------------------------------------------------------------------

dayjs.extend(relativeTime);
// Russian-language news portal — dates read "20 июня 2026", not "20 Jun 2026".
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

/** output: 17 Apr 2022
 */
export function fDate(date: DateInput, format?: string): string | null {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid
    ? dayjs(date).format(format ?? formatStr.date)
    : "Invalid time value";
}

// ----------------------------------------------------------------------

/** output: a few seconds, 2 years
 */
export function fToNow(date: DateInput): string | null {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).toNow(true) : "Invalid time value";
}
