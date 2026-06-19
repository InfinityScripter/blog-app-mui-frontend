import type { Order } from "./types";

// ----------------------------------------------------------------------

export function rowInPage<T>(data: T[], page: number, rowsPerPage: number) {
  return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

// ----------------------------------------------------------------------

export function emptyRows(
  page: number,
  rowsPerPage: number,
  arrayLength: number,
) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

type Comparable = string | number | boolean | null;

function descendingComparator<T extends Record<keyof T, Comparable>>(
  a: T,
  b: T,
  orderBy: keyof T,
) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// ----------------------------------------------------------------------

export function getComparator<T extends Record<keyof T, Comparable>>(
  order: Order,
  orderBy: keyof T,
): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
