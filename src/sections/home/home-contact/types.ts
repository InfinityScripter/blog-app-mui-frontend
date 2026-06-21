export interface ContactLink {
  icon: string;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

export interface ContactCardProps {
  item: ContactLink;
}
