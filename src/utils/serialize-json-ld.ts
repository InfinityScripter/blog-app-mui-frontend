/** Serializes JSON-LD without allowing data to terminate the surrounding script tag. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
