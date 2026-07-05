export type ContactLinkKey =
  | "email"
  | "github"
  | "linkedin"
  | "telegram"
  | "location";

// Raw config: `labelKey` resolves to `home.contact.links.<key>`. A `value` is
// proper-noun data shown as-is; `valueKey` (location only) resolves to
// `home.contact.<key>` when the value itself is UI copy.
export interface ContactLink {
  icon: string;
  labelKey: ContactLinkKey;
  value?: string;
  valueKey?: ContactLinkKey;
  href?: string;
  external?: boolean;
}

// Locale-resolved shape passed to `ContactCard` (label/value already strings).
export interface ContactCardItem {
  icon: string;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

export interface ContactCardProps {
  item: ContactCardItem;
}
