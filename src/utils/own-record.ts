// Own-property lookup on a plain Record. `record[key] ?? fallback` is unsafe:
// keys that collide with Object.prototype (`constructor`, `__proto__`, …)
// resolve to inherited values, and `??` does not treat a Function/Object as
// nullish — React then crashes on «Functions are not valid as a child» / theme
// lookups blow up on `palette[Function]`. See tagLabel / vendorColor.

export function ownRecordGet<T>(
  record: Record<string, T> | undefined,
  key: string,
  fallback: T,
): T {
  if (record && Object.prototype.hasOwnProperty.call(record, key)) {
    return record[key];
  }
  return fallback;
}

export function ownRecordHas(
  record: Record<string, unknown> | undefined,
  key: string,
): boolean {
  return Boolean(record && Object.prototype.hasOwnProperty.call(record, key));
}
