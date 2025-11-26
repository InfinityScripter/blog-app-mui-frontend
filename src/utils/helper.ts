/**
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_flatten
 * https://github.com/you-dont-need-x/you-dont-need-lodash
 */

// ----------------------------------------------------------------------

interface Flattenable {
  [key: string]: unknown;
  children?: Flattenable[];
}

export function flattenArray<T extends Flattenable>(list: T[] | null | undefined, key = "children"): T[] {
  let children: T[] = [];

  const flatten = list?.map((item) => {
    const childrenKey = item[key] as T[] | undefined;
    if (childrenKey && Array.isArray(childrenKey) && childrenKey.length) {
      children = [...children, ...childrenKey];
    }
    return item;
  });

  return flatten?.concat(
    children.length ? flattenArray(children, key) : children,
  ) ?? [];
}

// ----------------------------------------------------------------------

export function flattenDeep<T>(array: T[] | null | undefined): T[] {
  const isArray = array && Array.isArray(array);

  if (isArray) {
    return array.flat(Infinity) as T[];
  }
  return [];
}

// ----------------------------------------------------------------------

type OrderDirection = "asc" | "desc";

export function orderBy<T extends Record<string, unknown>>(
  array: T[],
  properties: (keyof T)[],
  orders?: OrderDirection[]
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

export function keyBy<T extends Record<string, unknown>>(
  array: T[] | null | undefined,
  key?: keyof T
): Record<string, T> {
  return (array || []).reduce((result, item) => {
    const keyValue = key ? item[key] : item;

    return { ...result, [String(keyValue)]: item };
  }, {} as Record<string, T>);
}

// ----------------------------------------------------------------------

export function sumBy<T>(array: T[], iteratee: (item: T) => number): number {
  return array.reduce((sum, item) => sum + iteratee(item), 0);
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

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
  }

  return false;
}

// ----------------------------------------------------------------------

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}

export function merge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;

  const source = sources.shift();

  if (!source) return target;

  // eslint-disable-next-line no-restricted-syntax
  for (const key in source) {
    if (isObject(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      merge(target[key] as T, source[key] as Partial<T>);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }

  return merge(target, ...sources);
}
