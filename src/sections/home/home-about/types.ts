export type AboutHighlightKey = "experience" | "stack" | "companies";

export interface AboutHighlight {
  icon: string;
  // `labelKey` → `home.about.highlights.<key>.label`.
  labelKey: AboutHighlightKey;
  // A static proper-noun `value`, or `valueKey` → `home.about.highlights.<key>.value`
  // when the value itself is UI copy.
  value?: string;
  valueKey?: AboutHighlightKey;
}
