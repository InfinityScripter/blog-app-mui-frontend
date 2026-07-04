/**
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_flatten
 * https://github.com/you-dont-need-x/you-dont-need-lodash
 */

// ----------------------------------------------------------------------

interface Flattenable {
  [key: string]: unknown;
  children?: Flattenable[];
}

function isFlattenableArray<T extends Flattenable>(
  value: unknown,
): value is T[] {
  return Array.isArray(value);
}

export function flattenArray<T extends Flattenable>(
  list: T[] | null | undefined,
  key = "children",
): T[] {
  let children: T[] = [];

  const flatten = list?.map((item) => {
    const childrenKey = item[key];
    if (isFlattenableArray<T>(childrenKey) && childrenKey.length) {
      children = [...children, ...childrenKey];
    }
    return item;
  });

  return (
    flatten?.concat(children.length ? flattenArray(children, key) : children) ??
    []
  );
}

// ----------------------------------------------------------------------

type OrderDirection = "asc" | "desc";

export function orderBy<T extends Record<string, unknown>>(
  array: T[],
  properties: (keyof T)[],
  orders?: OrderDirection[],
): T[] {
  return array.slice().sort((a, b) => {
    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i];
      const order = orders && orders[i] === "desc" ? -1 : 1;

      const aValue = a[property];
      const bValue = b[property];

      if (aValue < bValue) return -1 * order;
      if (aValue > bValue) return 1 * order;
    }
    return 0;
  });
}

// ----------------------------------------------------------------------

export function isEqual(a: unknown, b: unknown): boolean {
  if (a === null || a === undefined || b === null || b === undefined) {
    return a === b;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (
    typeof a === "string" ||
    typeof a === "number" ||
    typeof a === "boolean"
  ) {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => isEqual(a[key], b[key]));
  }

  return false;
}

// ----------------------------------------------------------------------

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}
